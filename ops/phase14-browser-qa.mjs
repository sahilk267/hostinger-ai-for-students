/**
 * Phase 14 Chromium acceptance, no external npm or Playwright dependency.
 * Runs only against an isolated localhost compiled build with mock/disabled mail.
 * Uses the native Chrome DevTools Protocol and Node 22 WebSocket. Never uses
 * production host/database, real identity, child profiles or email delivery.
 */
import { spawn, spawnSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

const base="http://127.0.0.1:43179";
const output=resolve("artifacts/phase14-browser-qa");
const testEnv={
  ...process.env,
  PORT:"43179",NODE_ENV:"production",
  JWT_SECRET:"CI-BROWSER-QA-ONLY-NOT-A-PRODUCTION-SECRET",
  PUBLIC_SITE_ORIGIN:base,
  CI:"true",ALLOW_INSECURE_LOOPBACK_ORIGIN_FOR_CI:"1",
  DATABASE_URL:"",DATABASE_HOST:"",DB_HOST:"",MYSQL_HOST:"",
  AUTH_ABUSE_DB_ENABLED:"0",AUTH_SESSIONS_ENFORCED:"0",
  NEWSLETTER_SIGNUP_ENABLED:"0",
  MANUS_STORAGE_PROXY_ENABLED:"0",MANUS_OAUTH_SERVER_ENABLED:"0",
  EXPLORER_CLOUD_SAVE_ENABLED:"0",EXPLORER_AI_FEEDBACK_ENABLED:"0",
  DISCOVERY_CHECKPOINTS_ENABLED:"0",
  HOSTINGER_MAIL_API_TOKEN:"",AUTH_MAIL_FROM:"",
};
const checks=[];
let app,chrome,ws,profile;
function check(condition,label,detail) {
  checks.push({label,pass:Boolean(condition),detail:condition?undefined:detail});
  if(!condition)throw new Error("Browser acceptance failed: "+label+(detail?" ("+detail+")":""));
}
async function poll(fn,label,max=45) {
  for(let i=0;i<max;i++) {
    const v=await fn().catch(()=>false);
    if(v)return v;
    await sleep(220);
  }
  throw new Error("Timeout: "+label);
}
async function kill(child) {
  if(!child || child.exitCode!==null)return;
  child.kill("SIGTERM");
  await Promise.race([
    new Promise(done=>child.once("exit",done)),
    sleep(1700),
  ]);
  if(child.exitCode===null)child.kill("SIGKILL");
}
function which(binary) {
  const p=spawnSync("which",[binary],{encoding:"utf8"});
  return p.status===0?p.stdout.trim():"";
}
async function connectBrowser(url) {
  const socket=new WebSocket(url);
  await Promise.race([
    new Promise((ok,fail)=>{
      socket.addEventListener("open",ok,{once:true});
      socket.addEventListener("error",()=>fail(Error("Chrome websocket failed")),{once:true});
    }),
    sleep(7500).then(()=>{throw Error("Chrome websocket timeout");}),
  ]);
  let id=0;
  const waiting=new Map();
  socket.addEventListener("message",event=>{
    let data;
    try {data=JSON.parse(String(event.data));}catch{return;}
    if(!data.id || !waiting.has(data.id))return;
    const task=waiting.get(data.id);
    waiting.delete(data.id);
    if(data.error)task.reject(Error(data.error.message||"Chrome DevTools request failed"));
    else task.resolve(data.result??{});
  });
  socket.addEventListener("close",()=>{
    for(const task of waiting.values())task.reject(Error("Chrome closed"));
    waiting.clear();
  });
  function send(method,params={},sessionId) {
    const requestId=++id;
    return new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>{
        waiting.delete(requestId);
        reject(Error("CDP timeout: "+method));
      },12000);
      waiting.set(requestId,{
        resolve:value=>{clearTimeout(timer);resolve(value);},
        reject:error=>{clearTimeout(timer);reject(error);},
      });
      socket.send(JSON.stringify({id:requestId,method,params,...(sessionId?{sessionId}:{})}));
    });
  }
  return {socket,send};
}
async function evalPage(sid,expression) {
  const result=await ws.send("Runtime.evaluate",
    {expression,returnByValue:true,awaitPromise:true},sid);
  if(result.exceptionDetails) {
    throw Error("Browser JS evaluation failed: "+(result.exceptionDetails.text||"expression"));
  }
  return result.result?.value;
}
async function openPage(path,width=1280,height=900) {
  const created=await ws.send("Target.createTarget",{url:"about:blank"});
  const attached=await ws.send("Target.attachToTarget",
    {targetId:created.targetId,flatten:true});
  const sid=attached.sessionId;
  await ws.send("Page.enable",{},sid);
  await ws.send("Runtime.enable",{},sid);
  await ws.send("Emulation.setDeviceMetricsOverride",
    {width,height,deviceScaleFactor:1,mobile:width<600},sid);
  await ws.send("Page.navigate",{url:base+path},sid);
  await poll(()=>evalPage(sid,
    "document.readyState === 'complete' && !!document.querySelector('#root > *')"),
    "React page "+path,50);
  await sleep(280);
  return {sid,targetId:created.targetId,width,height,path};
}
async function snapshot(page,name) {
  const data=await ws.send("Page.captureScreenshot",
    {format:"png",captureBeyondViewport:true,fromSurface:true},page.sid);
  const bytes=Buffer.from(data.data,"base64");
  check(bytes.length>2000,"Screenshot "+name+" generated");
  await writeFile(join(output,name+".png"),bytes);
}
async function textIncludes(page,needle) {
  return Boolean(await evalPage(page.sid,
    "(document.body?.innerText || '').includes("+JSON.stringify(needle)+")"));
}
async function waitText(page,text) {
  await poll(()=>textIncludes(page,text),"visible text "+text,60);
}
async function assertNoHorizontalOverflow(page,label) {
  const sizes=await evalPage(page.sid,
    "({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth,inner:innerWidth})");
  check(sizes.scroll<=sizes.client+3,
    label+" no horizontal page overflow",JSON.stringify(sizes));
}
async function closePage(page) {
  await ws.send("Target.closeTarget",{targetId:page.targetId});
}

try {
  await mkdir(output,{recursive:true});
  app=spawn(process.execPath,["dist/index.js"],{
    env:testEnv,stdio:["ignore","pipe","pipe"],
  });
  let appLog="";
  for(const stream of [app.stdout,app.stderr]){
    stream.on("data",chunk=>{appLog=(appLog+String(chunk)).slice(-2500);});
  }
  await poll(async()=>{
    if(app.exitCode!==null)throw Error("Isolated app exited: "+appLog.slice(-450));
    const r=await fetch(base+"/healthz",{signal:AbortSignal.timeout(800)});
    return r.status===200;
  },"isolated app healthy",45);
  const browserBin=process.env.CHROME_BIN || [
    "google-chrome","google-chrome-stable","chromium","chromium-browser",
  ].map(which).find(Boolean);
  check(Boolean(browserBin),"Chromium executable installed");
  profile=await mkdtemp(join(tmpdir(),"aifs-phase14-chrome-"));
  chrome=spawn(browserBin,[
    "--headless=new","--no-sandbox","--disable-gpu","--disable-dev-shm-usage",
    "--disable-background-networking","--disable-extensions","--no-first-run",
    "--no-default-browser-check","--no-zygote",
    "--host-resolver-rules=MAP * 0.0.0.0, EXCLUDE 127.0.0.1, EXCLUDE localhost",
    "--user-data-dir="+profile,"--remote-debugging-port=0",
    "--window-size=1280,900","about:blank",
  ],{stdio:["ignore","ignore","pipe"]});
  let chromeLog="";
  chrome.stderr.on("data",chunk=>{chromeLog=(chromeLog+String(chunk)).slice(-1100);});
  const active=await poll(async()=>{
    if(chrome.exitCode!==null)throw Error("Chromium exited: "+chromeLog);
    const contents=await readFile(join(profile,"DevToolsActivePort"),"utf8");
    return contents.trim().split("\n").length===2?contents.trim().split("\n"):false;
  },"Chromium debugging port",60);
  ws=await connectBrowser("ws://127.0.0.1:"+active[0]+active[1]);

  const home=await openPage("/");
  await waitText(home,"Start Free Adventure");
  check(await textIncludes(home,"Everything in one clear journey."),
    "Homepage features the four-stage onboarding roadmap");
  check(await evalPage(home.sid,
    "!!document.querySelector('a[href=\"/journey\"]')"),
    "Legacy 30-day Journey link remains available");
  check(await evalPage(home.sid,
    "!!document.querySelector('a[href=\"/for-parents\"]')"),
    "Parent guide visible from homepage");
  await waitText(home,"Adult email notes are not accepting subscriptions yet.");
  check(!(await textIncludes(home,"You're on the list")),
    "Newsletter does not falsely claim the browser subscribed");
  check(await evalPage(home.sid,
    "!!document.querySelector('.phase14-feedback-panel form')"),
    "Real adult feedback entry available on homepage");
  await assertNoHorizontalOverflow(home,"Desktop homepage");
  await snapshot(home,"01-home-desktop");
  await closePage(home);

  for(const width of [360,320]) {
    const mobile=await openPage("/",width,740);
    await waitText(mobile,"Start Free Adventure");
    await assertNoHorizontalOverflow(mobile,width+"px homepage");
    const cta=await evalPage(mobile.sid,
      "(()=>{const a=[...document.querySelectorAll('a')].find(e=>e.textContent.includes('Start Free Adventure'));if(!a)return null;const r=a.getBoundingClientRect();return {left:r.left,right:r.right,width:r.width,visible:getComputedStyle(a).display!=='none'};})()");
    check(cta && cta.visible && cta.left>=-2 && cta.right<=width+2,
      width+"px primary CTA fits viewport",JSON.stringify(cta));
    const toggled=await evalPage(mobile.sid,
      "(()=>{const b=document.querySelector('button.mobile-menu');if(!b)return false;b.click();return true;})()");
    check(toggled,width+"px mobile navigation toggle exists");
    const menu=await poll(()=>evalPage(mobile.sid,
      "!!document.querySelector('.desktop-nav.is-open a[href=\"/explorer/adventure\"]')"),
      width+"px mobile menu React update",30);
    check(menu,width+"px mobile menu opens Discovery Adventure link");
    await snapshot(mobile,"02-home-"+width+"px-menu");
    await closePage(mobile);
  }

  const dash=await openPage("/my-journey",360,780);
  await waitText(dash,"Your next adventure is ready.");
  check(await evalPage(dash.sid,
    "document.querySelector('.phase14-journey-card')?.textContent.includes('0/9')===true"),
    "First-time dashboard shows zero practice without inventing a result");
  check(await evalPage(dash.sid,
    "!!document.querySelector('.phase14-journey-card a[href*=\"view=report\"]')"),
    "Parent report accessible immediately");
  await assertNoHorizontalOverflow(dash,"360px My Journey");
  await snapshot(dash,"03-my-journey-360px");
  await closePage(dash);

  const parent=await openPage("/for-parents",1280,900);
  await waitText(parent,"Three small sessions.");
  check(await evalPage(parent.sid,
    "document.querySelectorAll('.phase14-session').length===3"),
    "Parent guide displays exactly three activities");
  check(await textIncludes(parent,"No mission results yet"),
    "Parent guide does not invent personalized evidence");
  const before=await evalPage(parent.sid,
    "document.querySelector('.phase14-session h3')?.textContent");
  await evalPage(parent.sid,
    "([...document.querySelectorAll('.phase14-parent-controls button')].find(b=>b.textContent.includes('हिन्दी')))?.click()");
  const after=await evalPage(parent.sid,
    "document.querySelector('.phase14-session h3')?.textContent");
  check(Boolean(after)&&before!==after,
    "Parent plan language switch changes visible activity");
  await snapshot(parent,"04-parent-guide-desktop-hindi");
  await ws.send("Emulation.setEmulatedMedia",{media:"print"},parent.sid);
  const isPrintHidden=await evalPage(parent.sid,
    "getComputedStyle(document.querySelector('.phase14-page-header')).display==='none'");
  check(isPrintHidden,"Parent print mode hides navigation");
  await ws.send("Emulation.setEmulatedMedia",{media:"screen"},parent.sid);
  await closePage(parent);

  const parentMobile=await openPage("/for-parents",320,740);
  await waitText(parentMobile,"Three small sessions.");
  await assertNoHorizontalOverflow(parentMobile,"320px parent guide");
  await snapshot(parentMobile,"05-parent-guide-320px");
  await closePage(parentMobile);

  const adventure=await openPage("/explorer/adventure?age=8-10",360,780);
  await poll(()=>evalPage(adventure.sid,
    "document.querySelector('.discovery-adventure')?.getAttribute('data-age-band')==='8-10'"),
    "Adventure age deep link");
  check(await evalPage(adventure.sid,
    "document.querySelectorAll('.da-age-button').length===3"),
    "Adventure exposes three age bands");
  check(await evalPage(adventure.sid,
    "!!document.querySelector('.phase14-adventure-steps button')"),
    "Family-plan button visible in Adventure navigation");
  await assertNoHorizontalOverflow(adventure,"360px Adventure");
  await snapshot(adventure,"06-adventure-360px");
  await closePage(adventure);

  const gated=await openPage("/explorer/adventure?age=11-13&view=challenge",1280,900);
  check(await evalPage(gated.sid,
    "!document.querySelector('#da-transfer-panel')"),
    "Direct Thinking Challenge link cannot bypass unsolved 9-mission gate");
  await closePage(gated);

  // Exercise the complete 9 + 3 UI hand-off using synthetic, non-learner
  // records generated from the actual current authored mission/challenge IDs.
  // This verifies navigation/state, not the reasoning engine or a real child's work.
  const fixtureRun=spawnSync("pnpm",["exec","tsx","ops/phase14-browser-fixture.ts"],{
    encoding:"utf8",timeout:12000,
  });
  check(fixtureRun.status===0,"Authoritative authored mission fixture generates");
  const fixture=JSON.parse(fixtureRun.stdout.trim());
  check(fixture.missions.length===9 && fixture.transfers.length===3,
    "Exactly nine authored missions and three new-situation challenges in selected band");
  const at="2026-11-10T00:00:00.000Z";
  const missionRecords=Object.fromEntries(fixture.missions.map(id=>[id,{
    firstCorrect:true,firstIndependent:true,bestCorrect:true,attempts:1,
    hintsUsed:0,enjoyed:null,updatedAt:at,
  }]));
  const transferRecords=Object.fromEntries(fixture.transfers.map(id=>[id,{
    firstCorrect:true,firstDecisionCorrect:true,firstReasonCorrect:true,
    solved:true,attempts:1,updatedAt:at,
  }]));
  const storagePage=await openPage("/my-journey");
  const setValue=(key,value)=>"localStorage.setItem("+JSON.stringify(key)+","+JSON.stringify(JSON.stringify(value))+");";
  await evalPage(storagePage.sid,"(()=>{"+
    setValue("aifs-discovery-adventure-v1",missionRecords)+
    "localStorage.setItem('aifs-discovery-adventure-age-band','11-13');return true;})()");
  await closePage(storagePage);

  const afterNine=await openPage("/my-journey");
  await waitText(afterNine,"9/9");
  check(await evalPage(afterNine.sid,
    "!!document.querySelector('.phase14-journey-card a[href*=\"view=challenge\"]')"),
    "Nine solved practice missions offer direct gated Thinking Challenge");
  await closePage(afterNine);

  const unlocked=await openPage("/explorer/adventure?age=11-13&view=challenge");
  await poll(()=>evalPage(unlocked.sid,
    "!!document.querySelector('#da-transfer-panel')"),
    "Thinking Challenge opens when all nine missions are solved");
  await closePage(unlocked);

  const seedTransfer=await openPage("/my-journey");
  await evalPage(seedTransfer.sid,"(()=>{"+
    setValue("aifs-discovery-transfer-v1",transferRecords)+
    "return true;})()");
  await closePage(seedTransfer);

  const afterTwelve=await openPage("/my-journey");
  await waitText(afterTwelve,"3/3");
  check(await evalPage(afterTwelve.sid,
    "!!document.querySelector('.phase14-journey-card a[href*=\"view=report\"]')"),
    "Twelve solved tasks route to private family milestone");
  await closePage(afterTwelve);

  const fullReport=await openPage("/explorer/adventure?age=11-13&view=report");
  await poll(()=>evalPage(fullReport.sid,
    "!!document.querySelector('#da-report-panel .dc-showcase-section.is-earned')"),
    "Private 12-task family milestone unlocks without accreditation claims");
  check(await evalPage(fullReport.sid,
    "!!document.querySelector('#da-report-panel .da-delete-action')"),
    "Browser practice can be deleted from the private report");
  await snapshot(fullReport,"08-private-milestone-12tasks-desktop");
  const deleted=await evalPage(fullReport.sid,
    "(()=>{window.confirm=()=>true;const b=document.querySelector('.da-delete-action');if(!b)return false;b.click();return true;})()");
  check(deleted,"User-controlled delete action available");
  await poll(()=>evalPage(fullReport.sid,
    "(()=>{try{return Object.keys(JSON.parse(localStorage.getItem('aifs-discovery-adventure-v1')||'{}')).length===0 && Object.keys(JSON.parse(localStorage.getItem('aifs-discovery-transfer-v1')||'{}')).length===0;}catch{return false;}})()"),
    "Clear browser-local missions and challenges",45);
  await closePage(fullReport);

  const reset=await openPage("/my-journey");
  await waitText(reset,"0/9");
  await closePage(reset);

  const token="c".repeat(44),key="a".repeat(64);
  const email=await openPage("/newsletter/confirm?key="+key+"&token="+token,1280,900);
  await poll(()=>evalPage(email.sid,"location.search===''"),
    "Private email URL token removed from browser address bar");
  check(await textIncludes(email,"Confirm your email"),
    "Confirmation page shows deliberate button, not automatic opt-in");
  const res=await fetch(base+"/newsletter/confirm?key="+key+"&token="+token);
  check(res.headers.get("referrer-policy")==="no-referrer" &&
    res.headers.get("cache-control")?.includes("no-store"),
    "Private HTML response rejects referrer leakage and caching");
  await snapshot(email,"07-email-confirmation-sanitized");
  await closePage(email);

  await writeFile(join(output,"report.json"),JSON.stringify({
    version:"phase14-browser-qa-v1",
    branchScope:"isolated localhost compiled app",
    noRealUsers:true,noExternalMail:true,noProductionDatabase:true,
    checkedOn:"Chromium headless desktop, 360px and 320px",
    pass:checks.every(x=>x.pass),checks,
  },null,2));
  console.log("Phase 14 browser QA PASS: "+checks.length+" assertions, 8 screenshots; isolated app only");
} catch(error) {
  console.error(error instanceof Error?error.message:"Browser QA failed");
  await mkdir(output,{recursive:true}).catch(()=>{});
  await writeFile(join(output,"report.json"),JSON.stringify({
    version:"phase14-browser-qa-v1",pass:false,checks,
    error:error instanceof Error?error.message:"Browser QA failed",
  },null,2)).catch(()=>{});
  process.exitCode=1;
} finally {
  if(ws?.socket)ws.socket.close();
  await kill(chrome);
  await kill(app);
  if(profile)await rm(profile,{recursive:true,force:true}).catch(()=>{});
}

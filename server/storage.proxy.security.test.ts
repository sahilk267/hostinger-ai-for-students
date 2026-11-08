import { afterEach, describe, expect, it, vi } from "vitest";
import type { Express } from "express";
import { isAllowedPublicStorageKey, registerStorageProxy } from "./_core/storageProxy";

const oldEnabled=process.env.MANUS_STORAGE_PROXY_ENABLED;
const oldPrefix=process.env.MANUS_STORAGE_PUBLIC_PREFIX;
afterEach(()=>{
  if(oldEnabled===undefined)delete process.env.MANUS_STORAGE_PROXY_ENABLED;
  else process.env.MANUS_STORAGE_PROXY_ENABLED=oldEnabled;
  if(oldPrefix===undefined)delete process.env.MANUS_STORAGE_PUBLIC_PREFIX;
  else process.env.MANUS_STORAGE_PUBLIC_PREFIX=oldPrefix;
});

describe("privileged storage URL proxy safety",()=>{
  it("requires an explicit public-only prefix and rejects traversal/encoded paths",()=>{
    expect(isAllowedPublicStorageKey("public/lessons/cover.png","public/")).toBe(true);
    for(const key of [
      "private/cover.png","public/../private/key","public/%2e%2e/private/key",
      "public//double","public\\sneak","public/escape?x=1","public/escape#x","public/"
    ]) expect(isAllowedPublicStorageKey(key,"public/")).toBe(false);
    for(const prefix of ["","/", "../", "public", "public/%2e/"]) {
      expect(isAllowedPublicStorageKey("public/lessons/cover.png",prefix)).toBe(false);
    }
  });
  it("refuses presigning without feature flag or when the key is not public",async()=>{
    let route: ((req:unknown,res:unknown)=>Promise<void>)|undefined;
    registerStorageProxy({get(_path:string,handler:typeof route){route=handler;}} as unknown as Express);
    expect(route).toBeDefined();
    const makeRes=()=>{
      const res={status:vi.fn(),send:vi.fn()};
      res.status.mockReturnValue(res);
      return res;
    };
    const r1=makeRes();
    process.env.MANUS_STORAGE_PROXY_ENABLED="0";
    await route!({params:{"0":"public/cover.png"}},r1);
    expect(r1.status).toHaveBeenCalledWith(404);
    const r2=makeRes();
    process.env.MANUS_STORAGE_PROXY_ENABLED="1";
    process.env.MANUS_STORAGE_PUBLIC_PREFIX="public/";
    await route!({params:{"0":"private/secret.txt"}},r2);
    expect(r2.status).toHaveBeenCalledWith(403);
    expect(r2.send).toHaveBeenCalledWith("Storage key is not public");
  });
});

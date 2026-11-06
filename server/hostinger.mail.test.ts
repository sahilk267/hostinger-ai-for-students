import { describe, expect, it } from "vitest";

// Live account test: opt in explicitly; never contact a real mailbox during routine CI.
const describeLiveMail = process.env.RUN_HOSTINGER_LIVE_MAIL_TEST === "1" ? describe : describe.skip;
describeLiveMail("Hostinger Mail API credential", () => {
  it("authenticates against the current-account endpoint", async () => {
    const token = process.env.HOSTINGER_MAIL_API_TOKEN;
    expect(token, "HOSTINGER_MAIL_API_TOKEN must be configured").toBeTruthy();

    const response = await fetch("https://api.mail.hostinger.com/api/v1/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const body = await response.text();
    expect(response.status, `Hostinger Mail API returned ${response.status}: ${body}`).not.toBe(401);
    expect(response.status, `Hostinger Mail API returned ${response.status}: ${body}`).not.toBe(403);
    expect(response.ok, `Hostinger Mail API returned ${response.status}: ${body}`).toBe(true);
    const payload = JSON.parse(body) as { data?: { mailboxes?: Array<{ address?: string }> } };
    const sender = process.env.AUTH_MAIL_FROM;
    expect(sender, "AUTH_MAIL_FROM must be configured").toBeTruthy();
    expect(payload.data?.mailboxes?.some((mailbox) => mailbox.address === sender)).toBe(true);
  }, 15_000);
});

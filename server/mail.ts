import { ENV } from "./_core/env";

type HostingerMailbox = { resourceId: string; address: string };
type HostingerMeResponse = { data?: { mailboxes?: HostingerMailbox[] } };

type SendAuthenticationCodeInput = {
  to: string;
  code: string;
  expiresInMinutes?: number;
};

type SendContactMessageInput = {
  name: string;
  replyEmail: string;
  subject: string;
  message: string;
};

const HOSTINGER_MAIL_BASE_URL = "https://api.mail.hostinger.com";
let mailboxCache: HostingerMailbox | null = null;

function requireMailConfig() {
  if (!ENV.hostingerMailApiToken) {
    throw new Error("Hostinger Mail API is not configured");
  }
  if (!ENV.authMailFrom) {
    throw new Error("Authentication sender is not configured");
  }
}

async function hostingerRequest(path: string, init?: RequestInit) {
  requireMailConfig();
  const response = await fetch(`${HOSTINGER_MAIL_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${ENV.hostingerMailApiToken}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const body = await response.text();
  if (!response.ok) {
    throw new Error(`Hostinger Mail API request failed with status ${response.status}`);
  }

  return body ? JSON.parse(body) : undefined;
}

async function getSenderMailbox() {
  if (mailboxCache?.address === ENV.authMailFrom) return mailboxCache;

  const payload = (await hostingerRequest("/api/v1/me")) as HostingerMeResponse;
  const mailbox = payload.data?.mailboxes?.find((item) => item.address === ENV.authMailFrom);
  if (!mailbox) {
    throw new Error("Configured authentication sender is not available in Hostinger Mail API");
  }

  mailboxCache = mailbox;
  return mailbox;

}

export async function sendAuthenticationCode({ to, code, expiresInMinutes = 10 }: SendAuthenticationCodeInput) {
  if (!to || !code) throw new Error("Authentication email recipient and code are required");
  const mailbox = await getSenderMailbox();
  await hostingerRequest(`/api/v1/mailboxes/${encodeURIComponent(mailbox.resourceId)}/send`, {
    method: "POST",
    body: JSON.stringify({
      to: [to],
      subject: "Your AI for Students verification code",
      text: `Your AI for Students verification code is ${code}. It expires in ${expiresInMinutes} minutes. If you did not request this code, you can ignore this email.`,
    }),
  });
}

export async function sendContactMessage({ name, replyEmail, subject, message }: SendContactMessageInput) {
  if (!name || !replyEmail || !subject || !message) throw new Error("Contact message fields are required");
  const mailbox = await getSenderMailbox();
  await hostingerRequest(`/api/v1/mailboxes/${encodeURIComponent(mailbox.resourceId)}/send`, {
    method: "POST",
    body: JSON.stringify({
      to: [ENV.authMailFrom],
      subject: `[AI for Students contact] ${subject}`,
      reply_to: [replyEmail],
      text: `Name: ${name}\nReply email: ${replyEmail}\n\n${message}`,
    }),
  });
}

/** A confirmation request only, never an assertion of an active subscription.
 * No newsletter campaigns are sent by this application.
 */
export async function sendNewsletterOptInEmail(input: {
  to: string; confirmUrl: string; unsubscribeUrl: string;
}) {
  const mailbox = await getSenderMailbox();
  await hostingerRequest(`/api/v1/mailboxes/${encodeURIComponent(mailbox.resourceId)}/send`, {
    method: "POST",
    body: JSON.stringify({
      to: [input.to],
      subject: "Confirm your adult AI for Students email notes",
      text: "You requested adult-only AI for Students learning notes.\\n\\n" +
        "Confirm your email within 30 minutes:\\n" + input.confirmUrl + "\\n\\n" +
        "If you did not request this, ignore this message. No subscription is active until confirmation.\\n\\n" +
        "You can unsubscribe at any time using this private link:\\n" + input.unsubscribeUrl + "\\n\\n" +
        "Never share these private links. We will not collect child learning records through the newsletter.",
    }),
  });
}

export function resetHostingerMailboxCacheForTests() {
  mailboxCache = null;
}

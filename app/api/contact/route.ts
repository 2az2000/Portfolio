import { NextResponse } from "next/server";
import { Resend } from "resend";

// The address every contact-form submission gets delivered to. Not the
// dictionary's `contact.email` (that one is the *display* copy shown to
// visitors) — kept as its own constant so a locale content edit can never
// accidentally change where form submissions land.
const RECIPIENT_EMAIL = "amirali.zand79@gmail.com";

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set — contact form cannot send email.");
    return NextResponse.json(
      { error: "Email sending is not configured on the server." },
      { status: 500 }
    );
  }

  let body: { name?: string; email?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
  }
  // Minimal sanity check, not full RFC 5322 validation — good enough to
  // catch typos before we burn a send attempt on an unreachable address.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }

  const resend = new Resend(apiKey);

  // `onboarding@resend.dev` is Resend's own shared sending address for
  // accounts without a verified custom domain — it works out of the box,
  // no DNS setup required. `replyTo` is the visitor's address, so hitting
  // "reply" in the inbox goes straight to them, not back to this sender.
  const { error } = await resend.emails.send({
    from: "Portfolio Contact <onboarding@resend.dev>",
    to: RECIPIENT_EMAIL,
    replyTo: email,
    subject: `Portfolio contact from ${name}`,
    text: `${message}\n\n— ${name} (${email})`,
  });

  if (error) {
    console.error("Resend send failed:", error);
    return NextResponse.json({ error: "Failed to send message." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

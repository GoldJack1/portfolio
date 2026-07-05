import { NextResponse } from "next/server";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site-config";

interface ContactPayload {
  name?: string;
  email?: string;
  message?: string;
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Contact form is not configured. Add RESEND_API_KEY to your environment." },
      { status: 503 },
    );
  }

  let body: ContactPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const fromAddress = process.env.RESEND_FROM ?? `${SITE_NAME} Contact <onboarding@resend.dev>`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromAddress,
      to: [CONTACT_EMAIL],
      reply_to: email,
      subject: `Contact form: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("Resend error:", detail);
    return NextResponse.json({ error: "Failed to send message. Please try again later." }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}

import { NextResponse } from "next/server";

// POST /api/newsletter — validates an email. With EMAIL_PROVIDER set it should
// add the address to a real list (Klaviyo, Mailchimp…). Without it, logs the
// signup and confirms (dev mode). Never a fake success on an invalid email.
export async function POST(req: Request) {
  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo de la petición inválido." }, { status: 400 });
  }
  const email = typeof body.email === "string" ? body.email : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "El correo no es válido." }, { status: 400 });
  }
  if (process.env.EMAIL_PROVIDER) {
    // Wire the real list provider here.
  }
  console.log("[newsletter] alta:", email);
  return NextResponse.json({ ok: true });
}

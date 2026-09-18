import { NextResponse } from "next/server";

// POST /api/contact — validates a contact message. With EMAIL_PROVIDER set it
// should forward to a real provider (Resend/Postmark). Without it, logs the
// message server-side and confirms receipt (dev mode).
export async function POST(req: Request) {
  let body: { name?: string; email?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo de la petición inválido." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name : "";
  const email = typeof body.email === "string" ? body.email : "";
  const message = typeof body.message === "string" ? body.message : "";

  const errors: Record<string, string> = {};
  if (!name.trim()) errors.name = "Nos falta tu nombre.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Ese correo no parece completo.";
  if (message.trim().length < 5) errors.message = "Cuéntanos un poco más.";
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  if (process.env.EMAIL_PROVIDER) {
    // Wire the real provider here. Falls through to the dev log until configured.
  }
  console.log("[contact] mensaje recibido de", email, `(${message.trim().length} caracteres)`);
  return NextResponse.json({ ok: true });
}

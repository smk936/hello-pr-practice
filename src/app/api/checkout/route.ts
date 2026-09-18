import { NextResponse } from "next/server";

interface IncomingItem {
  title?: string;
  amount?: number;
  quantity?: number;
}

// POST /api/checkout — validates the order server-side and computes the total.
// With STRIPE_SECRET_KEY set it should create a Stripe PaymentIntent/Checkout
// Session (not wired yet). Without it, runs in DEV mode: no charge, returns a
// clearly-marked test order id. Never fakes a successful charge.
export async function POST(req: Request) {
  let body: { items?: IncomingItem[]; email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo de la petición inválido." }, { status: 400 });
  }

  const items = Array.isArray(body.items) ? body.items : [];
  const email = typeof body.email === "string" ? body.email : "";

  if (items.length === 0) {
    return NextResponse.json({ error: "La bolsa está vacía." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "El correo no es válido." }, { status: 400 });
  }

  const subtotal = items.reduce(
    (sum, i) => sum + (Number(i.amount) || 0) * (Number(i.quantity) || 0),
    0,
  );

  if (process.env.STRIPE_SECRET_KEY) {
    // Real payment path. Requires the `stripe` package + a PaymentIntent or
    // Checkout Session created here, returning its client secret / redirect URL.
    return NextResponse.json(
      {
        error:
          "Stripe está configurado pero la integración de pago aún no está implementada. " +
          "Ver README → ‘Connecting Stripe’.",
      },
      { status: 501 },
    );
  }

  const orderId = "TEST-" + Date.now().toString(36).toUpperCase();
  return NextResponse.json({ orderId, mode: "test", subtotal });
}

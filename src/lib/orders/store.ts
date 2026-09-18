// DEV order store — persists to this browser's localStorage so order history
// and confirmation work without a backend. Real orders will come from the
// payment/commerce provider once wired. Clearly marked "test" until then.

export interface OrderItem {
  title: string;
  variantTitle: string;
  quantity: number;
  amount: number;
  currencyCode: string;
}
export interface Order {
  id: string;
  createdAt: string;
  email: string;
  items: OrderItem[];
  subtotal: number;
  currencyCode: string;
  mode: "test" | "live";
}

const KEY = "cenit.orders.v1";

export function getOrders(): Order[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

export function getOrder(id: string): Order | null {
  return getOrders().find((o) => o.id === id) ?? null;
}

export function saveOrder(order: Order): void {
  try {
    localStorage.setItem(KEY, JSON.stringify([order, ...getOrders()]));
  } catch {
    /* ignore */
  }
}

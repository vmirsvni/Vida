import type { OrderStatus } from "@/lib/store/store";

export const ORDER_STATUS4: Record<OrderStatus, string> = {
  awaiting_payment: "در انتظار پرداخت",
  processing: "در حال آماده‌سازی",
  shipped: "ارسال شد",
  delivered: "تحویل شد",
  cancelled: "لغو شد",
};

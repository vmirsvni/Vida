"use client";

import { buildPlan, METHODS, type PaymentMethod, type PaymentPlan } from "@/lib/booking/payment";
import { faDateLong, faNum, toman } from "@/lib/format";

/** Brand mark drawn as text — no third-party logos are used in the demo. */
export function MethodMark({ method, size = 40 }: { method: PaymentMethod; size?: number }) {
  const m = METHODS[method];
  const letter = method === "direct" ? "₸" : method === "snapppay" ? "S" : "D";
  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white"
      style={{ width: size, height: size, background: m.color, fontSize: size * 0.42 }}
    >
      {method === "direct" ? (
        <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="2.5" y="5" width="19" height="14" rx="2" />
          <path d="M2.5 9.5h19M6 15h4" />
        </svg>
      ) : (
        letter
      )}
    </span>
  );
}

export function MethodPicker({
  price,
  value,
  onChange,
}: {
  price: number;
  value: PaymentMethod;
  onChange: (m: PaymentMethod) => void;
}) {
  return (
    <fieldset>
      <legend className="font-display text-[24px] text-wine">روش پرداخت</legend>
      <div className="mt-5 grid gap-3" role="radiogroup">
        {(Object.keys(METHODS) as PaymentMethod[]).map((k) => {
          const m = METHODS[k];
          const plan = buildPlan(price, k);
          const on = value === k;
          return (
            <label
              key={k}
              className={`flex cursor-pointer items-center gap-4 border p-4 transition-colors sm:p-5 ${
                on ? "border-wine bg-ivory shadow-[0_0_0_1px_var(--color-wine)]" : "border-line hover:border-wine/40"
              }`}
            >
              <input
                type="radio"
                name="pay-method"
                value={k}
                checked={on}
                onChange={() => onChange(k)}
                className="sr-only"
              />
              <MethodMark method={k} />
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-baseline gap-x-3">
                  <span className="text-[17px] text-espresso">{m.title}</span>
                  <span className="text-[13px] text-muted">{m.short}</span>
                </span>
                <span className="mt-1 block text-[13px] leading-6 text-muted">{m.note}</span>
              </span>
              <span className="text-left">
                <span className="block text-[12px] text-muted">{k === "direct" ? "پرداخت امروز" : "قسط اول"}</span>
                <span className="block text-[16px] text-espresso">{toman(plan.installments[0].amount)}</span>
              </span>
              <span
                aria-hidden
                className={`size-5 shrink-0 rounded-full border ${on ? "border-[6px] border-wine" : "border-line"}`}
              />
            </label>
          );
        })}
      </div>
      {value !== "direct" && (
        <p className="mt-3 text-[12px] leading-6 text-muted">
          شرایط اقساط نمایشی است و در نسخه نهایی از سرویس {METHODS[value].title} دریافت می‌شود.
        </p>
      )}
    </fieldset>
  );
}

export function PlanTable({ plan, onPay }: { plan: PaymentPlan; onPay?: (n: number) => void }) {
  const next = plan.installments.find((i) => !i.paidAt);
  return (
    <ol className="divide-y divide-line border border-line bg-ivory/60">
      {plan.installments.map((i) => (
        <li key={i.n} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 text-[14px]">
          <span className="t-num w-8 text-[20px] leading-none text-champagne">{faNum(i.n)}</span>
          <span className="min-w-0 flex-1">
            <span className="block text-espresso">{toman(i.amount)}</span>
            <span className="block text-[12px] text-muted">سررسید {faDateLong(i.due)}</span>
          </span>
          {i.paidAt ? (
            <span className="rounded-full bg-[#e6f2ea] px-3 py-1 text-[12px] text-[#2f6b45]">پرداخت شد</span>
          ) : onPay && next?.n === i.n ? (
            <button type="button" onClick={() => onPay(i.n)} className="btn btn-primary min-h-10 px-4 text-[13px]">
              پرداخت قسط
            </button>
          ) : (
            <span className="rounded-full bg-cream px-3 py-1 text-[12px] text-muted">در انتظار</span>
          )}
        </li>
      ))}
    </ol>
  );
}

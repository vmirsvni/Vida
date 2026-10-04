"use client";

import Image from "next/image";
import Link from "next/link";
import { getMedia4 } from "@/data/media4";
import { site } from "@/data/site";
import { METHODS } from "@/lib/booking/payment";
import { statusLabel } from "@/lib/booking/policy";
import { useDemo, useHydrated } from "@/lib/store/store";
import { appointmentDate, durationLabel, faDateLong, faNum, faTime, toman } from "@/lib/format";
import { D4 } from "@/lib/demo";

/* Demo 4 confirmation — styled as an "analysis report / receipt". */
export function Success4({ id }: { id: string }) {
  const s = useDemo();
  const hydrated = useHydrated();
  const b = s.bookings.find((x) => x.id === id);
  if (!hydrated) return <div className="h-[80vh]" />;
  if (!b) {
    return (
      <div className="mx-auto max-w-md px-6 py-32 text-center">
        <p className="text-[22px] font-medium">رزروی با این کد پیدا نشد.</p>
        <Link href={`${D4}/booking`} className="btn btn-primary mt-8 px-7">
          رزرو نوبت
        </Link>
      </div>
    );
  }
  const svc = s.services.find((x) => x.slug === b.serviceSlug);
  const sp = s.specialists.find((x) => x.id === b.specialistId);
  const msgs = s.sms.filter((m) => m.bookingId === b.id);
  const img = svc ? getMedia4(svc.image) : null;
  const plan = b.payment;

  function ics() {
    const start = appointmentDate(b!.date, b!.start);
    const end = new Date(start.getTime() + b!.durationMin * 60000);
    const f = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const body = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Vida Beauty//Booking//FA",
      "BEGIN:VEVENT",
      `UID:${b!.id}@vida-beauty`,
      `DTSTAMP:${f(new Date())}`,
      `DTSTART:${f(start)}`,
      `DTEND:${f(end)}`,
      `SUMMARY:Vida Beauty · ${svc?.title}`,
      `LOCATION:${site.address}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([body], { type: "text/calendar" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${b!.id}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-10 lg:px-8 lg:py-16">
      <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        {/* report */}
        <article className="overflow-hidden rounded-[28px] border border-line bg-surface">
          <div className="nuve-lilac relative flex items-center gap-5 p-6 sm:p-8">
            <span className="relative flex size-16 shrink-0 items-center justify-center rounded-full bg-espresso text-[26px] text-white">
              ✓<span className="absolute inset-0 animate-ping rounded-full bg-champagne opacity-30" />
            </span>
            <div>
              <p className="text-[13px] font-medium text-champagne">{statusLabel[b.status]}</p>
              <h1 className="mt-1 text-[clamp(24px,3vw,34px)] font-medium">نوبت شما ثبت شد.</h1>
              <p className="mt-1 text-[13px] text-charcoal">جزئیات به {faNum(b.customer.phone)} پیامک شد.</p>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between rounded-2xl border border-dashed border-line-strong px-5 py-4">
              <span className="text-[12px] text-muted">کد رزرو</span>
              <span className="nuve-latin text-[28px] font-medium tracking-wide" dir="ltr">
                {b.id}
              </span>
            </div>

            <div className="mt-6 flex items-center gap-4">
              {img && (
                <span className="relative block size-20 shrink-0 overflow-hidden rounded-2xl">
                  <Image src={img.src} alt="" fill sizes="80px" className="object-cover" style={{ objectPosition: img.focal }} />
                </span>
              )}
              <div>
                <p className="text-[18px] font-medium">{svc?.title}</p>
                <p className="text-[12px] text-muted">
                  {durationLabel(b.durationMin)} · {sp?.name}
                </p>
              </div>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-3">
              {[
                ["تاریخ", faDateLong(b.date)],
                ["ساعت", faTime(b.start)],
                ["روش پرداخت", plan ? METHODS[plan.method].title : "-"],
                ["پرداخت‌شده", toman(b.paid)],
              ].map(([k, v]) => (
                <div key={k} className="rounded-2xl bg-cream p-4">
                  <dt className="text-[11px] text-muted">{k}</dt>
                  <dd className="mt-1 text-[15px] font-medium">{v}</dd>
                </div>
              ))}
            </dl>

            {plan && plan.method !== "direct" && (
              <div className="mt-6">
                <p className="mb-3 text-[13px] text-charcoal">
                  برنامه اقساط {METHODS[plan.method].title} · باقی‌مانده {toman(b.price - b.paid)}
                </p>
                <ol className="relative grid grid-cols-4 gap-2">
                  <span aria-hidden className="absolute inset-x-6 top-4 h-px bg-line-strong" />
                  {plan.installments.map((i) => (
                    <li key={i.n} className="relative flex flex-col items-center text-center">
                      <span className={`relative z-10 flex size-8 items-center justify-center rounded-full text-[12px] ${i.paidAt ? "bg-espresso text-white" : "bg-surface text-charcoal ring-1 ring-line-strong"}`}>
                        {i.paidAt ? "✓" : faNum(i.n)}
                      </span>
                      <span className="mt-2 text-[11px] font-medium">{toman(i.amount)}</span>
                      <span className="text-[10px] text-muted">{i.paidAt ? "پرداخت شد" : faDateLong(i.due).split(" ").slice(1, 3).join(" ")}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={ics} className="btn btn-primary px-6">
                افزودن به تقویم
              </button>
              <Link href={`${D4}/account`} className="btn nuve-btn-lilac px-6">
                پنل کاربر
              </Link>
              <a href={`tel:${site.phone}`} className="btn btn-ghost px-6 text-espresso">
                تماس با سالن
              </a>
            </div>
            <p className="mt-5 text-[12px] leading-6 text-muted">
              تغییر زمان فقط تلفنی است. لغو تا ۲۴ ساعت پیش از نوبت با بازگشت ۸۰٪ مبلغ پرداخت‌شده امکان‌پذیر است.
            </p>
          </div>
        </article>

        {/* sms */}
        <aside aria-labelledby="sms4" className="rounded-[28px] border border-line bg-surface p-6 sm:p-8">
          <p id="sms4" className="text-[13px] text-muted">
            پیامک‌ها <span className="text-[11px]">(شبیه‌سازی دمو)</span>
          </p>
          <div className="mt-5 space-y-4">
            {msgs.map((m, k) => (
              <div key={m.id} className="anim-rise" style={{ ["--d" as string]: `${300 + k * 400}ms` }}>
                <div className="flex items-end gap-2">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-tint text-[11px] text-accent-deep">VB</span>
                  <p className={`whitespace-pre-line rounded-2xl rounded-br-md px-4 py-3 text-[13px] leading-6 ${m.status === "scheduled" ? "bg-cream text-muted" : "bg-cream text-espresso"}`}>{m.body}</p>
                </div>
                <p className="mr-10 mt-1 text-[10px] text-faint">{m.status === "scheduled" ? "زمان‌بندی‌شده · ۲۴ ساعت پیش از نوبت" : "هم‌اکنون"}</p>
              </div>
            ))}
            {!msgs.length && <p className="text-[13px] text-muted">پیامی ثبت نشده است.</p>}
          </div>
        </aside>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";
import { useDemo, useHydrated } from "@/lib/store/store";
import { appointmentDate, durationLabel, faDateLong, faNum, faTime, toman } from "@/lib/format";
import { ArrowLeft, Phone } from "@/components/ui/Icons";
import { statusLabel } from "@/lib/booking/policy";
import { useDemoBase } from "@/lib/useDemoBase";
import { METHODS } from "@/lib/booking/payment";
import { PlanTable } from "@/components/booking/PaymentUI";

export function BookingSuccess({ id }: { id: string }) {
  const base = useDemoBase();
  const s = useDemo();
  const hydrated = useHydrated();
  const b = s.bookings.find((x) => x.id === id);
  if (!hydrated) return <div className="h-[80vh]" />;
  if (!b) {
    return (
      <div className="wrap py-32 text-center">
        <p className="t-h3 text-wine">رزروی با این کد پیدا نشد.</p>
        <Link href={`${base}/booking`} className="btn btn-primary mt-8">
          رزرو نوبت
        </Link>
      </div>
    );
  }
  const svc = s.services.find((x) => x.slug === b.serviceSlug);
  const sp = s.specialists.find((x) => x.id === b.specialistId);
  const messages = s.sms.filter((m) => m.bookingId === b.id);
  const confirmed = b.status === "confirmed" || b.status === "paid" || b.status === "completed";

  function addToCalendar() {
    const start = appointmentDate(b!.date, b!.start);
    const end = new Date(start.getTime() + b!.durationMin * 60000);
    const f = (d: Date) =>
      d
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "");
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Vida Beauty//Booking//FA",
      "BEGIN:VEVENT",
      `UID:${b!.id}@vida-beauty`,
      `DTSTAMP:${f(new Date())}`,
      `DTSTART:${f(start)}`,
      `DTEND:${f(end)}`,
      `SUMMARY:Vida Beauty — ${svc?.title}`,
      `LOCATION:${site.address}`,
      `DESCRIPTION:کد رزرو ${b!.id}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${b!.id}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="wrap grid gap-16 py-14 lg:grid-cols-12 lg:gap-8 lg:py-24">
      <section className="lg:col-span-7">
        <Image src="/brand/vida-logo-256.webp" alt="" width={72} height={72} className="anim-fade size-16" />
        <p className="t-eyebrow anim-rise mt-10 text-gold-ink">{confirmed ? "Booking Confirmed" : statusLabel[b.status]}</p>
        <h1 className="t-display anim-rise mt-5 text-wine" style={{ ["--d" as string]: "100ms" }}>
          رزرو شما با موفقیت ثبت شد.
        </h1>
        <p className="t-lead anim-rise mt-6 text-charcoal" style={{ ["--d" as string]: "200ms" }}>
          Vida Beauty از انتخاب شما سپاسگزار است.
        </p>

        <div className="anim-rise mt-12 border-y border-line py-8" style={{ ["--d" as string]: "300ms" }}>
          <p className="t-label">کد رزرو</p>
          <p
            className="t-num mt-1 text-[44px] leading-none tracking-wide text-wine lg:text-[56px]"
            dir="ltr"
            style={{ textAlign: "right" }}
          >
            {b.id}
          </p>
          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6">
            {[
              ["خدمت", svc?.title ?? ""],
              ["متخصص", sp?.name ?? ""],
              ["تاریخ", faDateLong(b.date)],
              ["ساعت", faTime(b.start)],
              ["مدت", durationLabel(b.durationMin)],
              ["روش پرداخت", b.payment ? METHODS[b.payment.method].title : "—"],
              ["مبلغ پرداخت‌شده", toman(b.paid)],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="t-label">{k}</dt>
                <dd className="mt-1 font-display text-[22px] leading-snug">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {b.payment && b.payment.method !== "direct" && (
          <div className="anim-rise mt-8" style={{ ["--d" as string]: "340ms" }}>
            <p className="t-label mb-3">
              برنامه اقساط {METHODS[b.payment.method].title} · باقی‌مانده {toman(b.price - b.paid)}
            </p>
            <PlanTable plan={b.payment} />
          </div>
        )}

        <p className="anim-rise mt-8 text-charcoal" style={{ ["--d" as string]: "380ms" }}>
          جزئیات رزرو به شماره موبایل شما پیامک خواهد شد.
        </p>
        <p className="mt-3 text-[14px] leading-7 text-muted">
          برای تغییر زمان رزرو، لطفاً با Vida Beauty تماس بگیرید. لغو تا ۲۴ ساعت پیش از نوبت با بازگشت ۸۰٪ مبلغ امکان‌پذیر است.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <button type="button" onClick={addToCalendar} className="btn btn-primary">
            افزودن به تقویم
          </button>
          <Link href={`${base}/account`} className="btn btn-ghost text-wine">
            مشاهده در پنل کاربر
          </Link>
          <a href={`tel:${site.phone}`} className="btn btn-ghost text-wine">
            <Phone size={16} /> تماس با سالن
          </a>
          <Link href={base} className="flex min-h-12 items-center gap-2 px-2 text-wine">
            <span className="link-draw">صفحه اصلی</span> <ArrowLeft className="arrow" size={16} />
          </Link>
        </div>
      </section>

      {/* Simulated SMS */}
      <aside className="lg:col-span-4 lg:col-start-9" aria-labelledby="sms-title">
        <p id="sms-title" className="t-label mb-4">
          پیش‌نمایش پیامک (شبیه‌سازی دمو)
        </p>
        <div className="mx-auto max-w-[340px] rounded-[44px] border border-espresso/15 bg-espresso p-3 shadow-[0_40px_80px_-40px_rgba(42,26,20,.45)]">
          <div className="overflow-hidden rounded-[34px] bg-[#f6f3ef]">
            <div className="flex flex-col items-center border-b border-black/5 bg-white/70 pb-3 pt-6">
              <span className="flex size-10 items-center justify-center rounded-full bg-wine text-[12px] text-champagne-light">
                VB
              </span>
              <span className="mt-1 text-[12px] text-charcoal">Vida Beauty</span>
            </div>
            <div className="min-h-[360px] space-y-4 p-4">
              {messages.length === 0 && <p className="text-center text-[12px] text-muted">پیامی ثبت نشده است.</p>}
              {messages.map((m, i) => (
                <div key={m.id} className="anim-rise" style={{ ["--d" as string]: `${600 + i * 500}ms` }}>
                  <p className="mb-1 text-center text-[10px] text-muted">
                    {m.status === "scheduled" ? "زمان‌بندی‌شده · ۲۴ ساعت پیش از نوبت" : "هم‌اکنون"}
                  </p>
                  <p
                    className={`w-fit max-w-[85%] whitespace-pre-line rounded-2xl rounded-br-md px-4 py-3 text-[13px] leading-6 ${m.status === "scheduled" ? "bg-white/70 text-muted" : "bg-white text-espresso"}`}
                  >
                    {m.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-4 text-center text-[12px] text-muted">
          در نسخه نهایی، پیامک از طریق سامانه پیامکی ایرانی به {faNum(b.customer.phone)} ارسال می‌شود.
        </p>
      </aside>
    </div>
  );
}

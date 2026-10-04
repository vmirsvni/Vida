"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Figure } from "@/components/ui/Figure";
import { ArrowLeft, ArrowRight, Check, Clock, Lock, Phone } from "@/components/ui/Icons";
import { Calendar } from "./Calendar";
import { ANY_SPECIALIST } from "@/data/specialists";
import { site } from "@/data/site";
import { canBook, dayStatus, mergedSlots, specialistSlots, type Slot } from "@/lib/booking/slots";
import { createBooking, useDemo, useHydrated } from "@/lib/store/store";
import { addDays, durationLabel, faDateLong, faNum, faTime, isValidMobile, normalizeDigits, todayKey, toman } from "@/lib/format";
import { useDemoBase } from "@/lib/useDemoBase";
import { MethodPicker } from "@/components/booking/PaymentUI";
import { buildPlan, METHODS, type PaymentMethod } from "@/lib/booking/payment";
import { D3, D4 } from "@/lib/demo";

interface Draft {
  service: string | null;
  specialist: string | null;
  date: string | null;
  time: string | null;
  assigned: string | null; // concrete specialist when "any" was chosen
  name: string;
  phone: string;
  notes: string;
  agreed: boolean;
  method: PaymentMethod;
}

const EMPTY: Draft = {
  service: null,
  specialist: null,
  date: null,
  time: null,
  assigned: null,
  name: "",
  phone: "",
  notes: "",
  agreed: false,
  method: "direct",
};
const DRAFT = "vida-booking-draft";
const STEPS = ["خدمت", "متخصص", "زمان", "اطلاعات", "پرداخت"];

export function BookingFlow() {
  const base = useDemoBase();
  const KEY = `${DRAFT}${base}`;
  const photoSet = base === D4 ? "demo4" : base === D3 ? "demo3" : "demo2";
  const router = useRouter();
  const params = useSearchParams();
  const step = Math.min(5, Math.max(1, Number(params.get("step")) || 1));
  const s = useDemo();
  const hydrated = useHydrated();
  const top = useRef<HTMLDivElement>(null);

  const [d, setD] = useState<Draft>(EMPTY);
  const [restored, setRestored] = useState(false);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // restore draft + deep-link ?service=
  useEffect(() => {
    let saved: Draft = EMPTY;
    try {
      saved = { ...EMPTY, ...JSON.parse(sessionStorage.getItem(KEY) || "{}") };
    } catch {}
    const svc = params.get("service");
    if (svc && svc !== saved.service) saved = { ...EMPTY, service: svc, name: saved.name, phone: saved.phone };
    // sessionStorage only exists after hydration, so the draft is restored in an effect
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setD(saved);
    setRestored(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!restored) return;
    try {
      sessionStorage.setItem(KEY, JSON.stringify(d));
    } catch {}
  }, [d, restored, KEY]);

  const patch = (p: Partial<Draft>) => setD((x) => ({ ...x, ...p }));

  const service = s.services.find((x) => x.slug === d.service) ?? null;
  const eligible = useMemo(
    () => s.specialists.filter((sp) => sp.active && (!service || sp.specialties.includes(service.slug))),
    [s.specialists, service],
  );
  const pool = useMemo(
    () => (d.specialist === ANY_SPECIALIST ? eligible : eligible.filter((sp) => sp.id === d.specialist)),
    [d.specialist, eligible],
  );

  const slotsFor = useCallback(
    (date: string): Slot[] => {
      if (!service || !pool.length) return [];
      const ctx = {
        date,
        durationMin: service.durationMin,
        bookings: s.bookings,
        blocks: s.blocks,
        bufferMin: s.settings.bufferMin,
      };
      return pool.length === 1 ? specialistSlots(pool[0], ctx) : mergedSlots(pool, ctx);
    },
    [service, pool, s.bookings, s.blocks, s.settings.bufferMin],
  );

  const getDay = useMemo(() => {
    const cache = new Map<string, ReturnType<typeof dayStatus>>();
    return (k: string) => {
      if (!cache.has(k)) cache.set(k, dayStatus(slotsFor(k)));
      return cache.get(k)!;
    };
  }, [slotsFor]);

  // arriving at the time step without a usable date → preselect the first available day
  // (adjusting state during render; converges because the new date is available)
  if (step === 3 && hydrated && restored && service && d.specialist) {
    const usable = d.date && d.date >= todayKey() && getDay(d.date).status !== "closed";
    if (!usable) {
      for (let i = 0; i < s.settings.bookingHorizonDays; i++) {
        const k = addDays(todayKey(), i);
        if (getDay(k).status === "available") {
          if (k !== d.date) setD((x) => ({ ...x, date: k, time: null, assigned: null }));
          break;
        }
      }
    }
  }

  const slots = d.date ? slotsFor(d.date) : [];
  const assignedSp = s.specialists.find((x) => x.id === (d.assigned ?? d.specialist));

  const phoneOk = isValidMobile(d.phone);
  const nameOk = d.name.trim().length >= 3;
  const valid = [
    !!service,
    !!d.specialist && (d.specialist === ANY_SPECIALIST || eligible.some((x) => x.id === d.specialist)),
    !!d.date && !!d.time,
    nameOk && phoneOk,
    d.agreed,
  ];
  const canNext = valid[step - 1];

  // guard: never show a step whose prerequisites are missing
  useEffect(() => {
    const firstInvalid = valid.findIndex((v) => !v);
    if (hydrated && restored && firstInvalid !== -1 && firstInvalid + 1 < step) go(firstInvalid + 1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, hydrated, restored, d.service, d.specialist, d.date, d.time]);

  function go(n: number, replace = false) {
    setTouched(false);
    setError(null);
    const url = `${base}/booking?step=${n}`;
    if (replace) router.replace(url, { scroll: false });
    else router.push(url, { scroll: false });
    requestAnimationFrame(() => top.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function next() {
    if (!canNext) {
      setTouched(true);
      return;
    }
    if (step < 5) return go(step + 1);
    // commit → hold the slot, go to the (mock) gateway
    const spId = d.assigned ?? d.specialist!;
    const sp = s.specialists.find((x) => x.id === spId)!;
    const ok = canBook(sp, d.time!, {
      date: d.date!,
      durationMin: service!.durationMin,
      bookings: s.bookings,
      blocks: s.blocks,
      bufferMin: s.settings.bufferMin,
    });
    if (!ok) {
      setError("این زمان همین حالا رزرو شد. لطفاً زمان دیگری انتخاب کنید.");
      patch({ time: null });
      return go(3);
    }
    const b = createBooking({
      serviceSlug: service!.slug,
      specialistId: spId,
      date: d.date!,
      start: d.time!,
      customer: { name: d.name.trim(), phone: normalizeDigits(d.phone).replace(/\D/g, "") },
      notes: d.notes.trim() || undefined,
      source: "online",
      status: "awaiting_payment",
    });
    router.push(`${base}/booking/pay?id=${b.id}&method=${d.method}`);
  }

  const firstPay = service ? buildPlan(service.price, d.method).installments[0].amount : 0;
  const cta =
    step === 5
      ? d.method === "direct"
        ? `پرداخت آنلاین · ${service ? toman(service.price) : ""}`
        : `پرداخت قسط اول · ${toman(firstPay)}`
      : "ادامه";

  return (
    <div ref={top} className="scroll-mt-[calc(var(--header-h)+8px)]">
      {/* Progress */}
      <nav aria-label="مراحل رزرو" className="wrap pt-8 lg:pt-14">
        <ol className="flex items-center gap-2 text-[12px] sm:gap-3 sm:text-[13px]">
          {STEPS.map((label, i) => {
            const n = i + 1;
            const done = n < step;
            const current = n === step;
            return (
              <li key={label} className="flex flex-1 items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  disabled={!done}
                  onClick={() => go(n)}
                  aria-current={current ? "step" : undefined}
                  className={`flex items-center gap-1.5 whitespace-nowrap transition-colors ${current ? "text-wine" : done ? "text-espresso hover:text-wine" : "text-muted/60"}`}
                >
                  <span
                    className={`flex size-5 items-center justify-center rounded-full border text-[10px] ${
                      current ? "border-wine bg-wine text-ivory" : done ? "border-wine text-wine" : "border-line"
                    }`}
                  >
                    {done ? <Check size={11} /> : faNum(n)}
                  </span>
                  <span className={current ? "" : "max-sm:hidden"}>{label}</span>
                </button>
                {n < 5 && <span aria-hidden className={`h-px flex-1 ${done ? "bg-wine" : "bg-line"}`} />}
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="wrap grid gap-12 pb-40 pt-10 lg:grid-cols-12 lg:gap-8 lg:pb-[var(--section-y)] lg:pt-14">
        <div className="lg:col-span-7" aria-live="polite">
          {!hydrated || !restored ? (
            <div className="h-96 animate-pulse bg-cream" />
          ) : (
            <>
              {step === 1 && (
                <Step title="چه خدمتی مدنظر شماست؟" eyebrow="Step 01 — Service">
                  <div role="radiogroup" aria-label="انتخاب خدمت" className="border-t border-line">
                    {s.services.map((x) => {
                      const on = d.service === x.slug;
                      return (
                        <button
                          key={x.slug}
                          type="button"
                          role="radio"
                          aria-checked={on}
                          onClick={() => patch({ service: x.slug, specialist: null, date: null, time: null, assigned: null })}
                          className={`group grid w-full grid-cols-[64px_1fr_auto] items-center gap-4 border-b border-line py-4 text-right transition-colors sm:grid-cols-[76px_1fr_auto] ${on ? "bg-cream" : "hover:bg-cream/60"}`}
                        >
                          <Figure name={x.image} ratio="4/5" sizes="80px" reveal={false} className="ms-0" set={photoSet} />
                          <span>
                            <span className="block font-display text-[24px] leading-tight text-espresso">{x.title}</span>
                            <span className="mt-1 block text-[13px] text-muted">
                              {durationLabel(x.durationMin)} · {toman(x.price)}
                            </span>
                          </span>
                          <Radio on={on} />
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-4 text-[12px] text-muted">قیمت‌ها نمونه دمو هستند.</p>
                </Step>
              )}

              {step === 2 && service && (
                <Step title="با کدام متخصص؟" eyebrow="Step 02 — Specialist">
                  <div role="radiogroup" aria-label="انتخاب متخصص" className="grid gap-3 sm:grid-cols-2">
                    <Choice
                      on={d.specialist === ANY_SPECIALIST}
                      onClick={() => patch({ specialist: ANY_SPECIALIST, date: null, time: null, assigned: null })}
                      title="فرقی ندارد"
                      sub="زودترین زمان خالی را به شما نشان می‌دهیم"
                      mark="✦"
                      wide
                    />
                    {eligible.map((sp) => (
                      <Choice
                        key={sp.id}
                        on={d.specialist === sp.id}
                        onClick={() => patch({ specialist: sp.id, date: null, time: null, assigned: null })}
                        title={sp.name}
                        sub={sp.title}
                        mark={faNum(sp.id.replace("s", ""))}
                      />
                    ))}
                  </div>
                </Step>
              )}

              {step === 3 && service && (
                <Step title="چه روزی و چه ساعتی؟" eyebrow="Step 03 — Date & Time">
                  {error && <p className="mb-6 border-r-2 border-wine bg-cream px-4 py-3 text-[14px] text-wine">{error}</p>}
                  <div className="grid gap-10 xl:grid-cols-2 xl:gap-12">
                    <Calendar
                      key={`${d.service}-${d.specialist}`}
                      value={d.date}
                      onChange={(k) => patch({ date: k, time: null, assigned: null })}
                      horizonDays={s.settings.bookingHorizonDays}
                      getDay={getDay}
                    />
                    <div>
                      <p className="font-display text-[22px] text-espresso">
                        {d.date ? faDateLong(d.date) : "یک روز انتخاب کنید"}
                      </p>
                      <p className="mt-1 flex items-center gap-2 text-[13px] text-muted">
                        <Clock size={14} /> مدت خدمت {durationLabel(service.durationMin)} · {faNum(s.settings.bufferMin)} دقیقه
                        فاصله آماده‌سازی بین نوبت‌ها
                      </p>
                      {d.date && getDay(d.date).status === "full" && (
                        <p className="mt-6 border-r-2 border-champagne bg-cream px-4 py-3 text-[13px]">
                          ظرفیت این روز تکمیل است. لطفاً روز دیگری را انتخاب کنید.
                        </p>
                      )}
                      {d.date && (
                        <ul className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-4 xl:grid-cols-3" aria-label="ساعت‌ها">
                          {slots.map((sl) => {
                            const on = d.time === sl.start && sl.status === "available";
                            const available = sl.status === "available";
                            return (
                              <li key={sl.start}>
                                <button
                                  type="button"
                                  disabled={!available}
                                  aria-pressed={on}
                                  onClick={() =>
                                    patch({ time: sl.start, assigned: d.specialist === ANY_SPECIALIST ? sl.specialistId! : null })
                                  }
                                  className={`flex h-14 w-full flex-col items-center justify-center border text-[15px] transition-colors duration-300 ${
                                    on
                                      ? "border-wine bg-wine text-ivory"
                                      : available
                                        ? "border-wine/30 text-espresso hover:border-wine"
                                        : sl.status === "booked"
                                          ? "cursor-not-allowed border-line bg-cream/70 text-muted"
                                          : "cursor-not-allowed border-dashed border-line text-muted/50"
                                  }`}
                                >
                                  <span className={sl.status === "booked" ? "line-through decoration-wine/40" : ""}>
                                    {faTime(sl.start)}
                                  </span>
                                  {!available && (
                                    <span className="text-[10px] leading-tight">
                                      {sl.status === "booked" ? "رزرو شده" : sl.reason === "past" ? "گذشته" : "بسته"}
                                    </span>
                                  )}
                                </button>
                              </li>
                            );
                          })}
                          {!slots.length && (
                            <li className="col-span-full text-[14px] text-muted">در این روز زمانی وجود ندارد.</li>
                          )}
                        </ul>
                      )}
                      <p className="mt-6 text-[12px] leading-6 text-muted">
                        همه زمان‌ها نمایش داده می‌شوند؛ زمان‌های رزروشده و بسته قابل انتخاب نیستند.
                      </p>
                    </div>
                  </div>
                </Step>
              )}

              {step === 4 && service && (
                <Step title="اطلاعات شما" eyebrow="Step 04 — Details">
                  <div className="grid gap-8">
                    <Field label="نام و نام خانوادگی" error={touched && !nameOk ? "لطفاً نام کامل خود را وارد کنید." : null}>
                      {(id) => (
                        <input
                          id={id}
                          className="field"
                          autoComplete="name"
                          value={d.name}
                          onChange={(e) => patch({ name: e.target.value })}
                          placeholder="مثلاً: سارا احمدی"
                        />
                      )}
                    </Field>
                    <Field
                      label="شماره موبایل"
                      error={touched && !phoneOk ? "شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود." : null}
                      hint="جزئیات رزرو به این شماره پیامک می‌شود."
                    >
                      {(id) => (
                        <input
                          id={id}
                          className="field text-left"
                          dir="ltr"
                          inputMode="tel"
                          autoComplete="tel"
                          value={d.phone}
                          onChange={(e) => patch({ phone: e.target.value })}
                          placeholder="09xx xxx xxxx"
                        />
                      )}
                    </Field>
                    <Field label="توضیحات (اختیاری)">
                      {(id) => (
                        <textarea
                          id={id}
                          rows={3}
                          className="field resize-none"
                          value={d.notes}
                          onChange={(e) => patch({ notes: e.target.value })}
                          placeholder="اگر نکته‌ای هست که باید بدانیم…"
                        />
                      )}
                    </Field>
                    <Summary service={service.title} specialist={assignedSp?.name} date={d.date} time={d.time} compact />
                  </div>
                </Step>
              )}

              {step === 5 && service && (
                <Step title="تأیید و پرداخت" eyebrow="Step 05 — Confirm">
                  <Summary
                    service={service.title}
                    specialist={assignedSp?.name}
                    date={d.date}
                    time={d.time}
                    name={d.name}
                    phone={d.phone}
                  />

                  <section aria-labelledby="policy-title" className="mt-10 bg-cream p-6 sm:p-8">
                    <h3 id="policy-title" className="font-display text-[24px] text-wine">
                      قوانین لغو و تغییر زمان
                    </h3>
                    <ul className="mt-5 space-y-4 text-[15px]">
                      <li className="grid grid-cols-[auto_1fr] gap-4">
                        <span className="t-num text-[22px] leading-none text-champagne">۸۰٪</span>
                        <span>
                          لغو تا <strong>۲۴ ساعت</strong> پیش از نوبت: {faNum(s.settings.cancellationFeePercent)}٪ مبلغ کسر و{" "}
                          <strong>۸۰٪ بازگردانده</strong> می‌شود.
                        </span>
                      </li>
                      <li className="grid grid-cols-[auto_1fr] gap-4">
                        <span className="t-num text-[22px] leading-none text-champagne">۰٪</span>
                        <span>
                          لغو <strong>کمتر از ۲۴ ساعت</strong> مانده به نوبت: مبلغی بازگردانده نمی‌شود.
                        </span>
                      </li>
                      <li className="grid grid-cols-[auto_1fr] gap-4">
                        <span className="text-champagne">
                          <Phone size={20} />
                        </span>
                        <span>
                          تغییر زمان به‌صورت آنلاین ممکن نیست. برای تغییر زمان رزرو، لطفاً با Vida Beauty تماس بگیرید.{" "}
                          <a href={`tel:${site.phone}`} className="text-wine underline underline-offset-4">
                            تماس با سالن
                          </a>
                        </span>
                      </li>
                    </ul>
                  </section>

                  <label className={`mt-8 flex cursor-pointer items-start gap-4 ${touched && !d.agreed ? "text-wine" : ""}`}>
                    <input
                      type="checkbox"
                      className="check"
                      checked={d.agreed}
                      onChange={(e) => patch({ agreed: e.target.checked })}
                    />
                    <span className="text-[15px] leading-8">قوانین رزرو و شرایط کنسلی را مطالعه کرده‌ام و می‌پذیرم.</span>
                  </label>
                  {touched && !d.agreed && <p className="mt-2 text-[13px] text-wine">برای ادامه، پذیرش قوانین لازم است.</p>}

                  <div className="mt-10">
                    <MethodPicker price={service.price} value={d.method} onChange={(method) => patch({ method })} />
                  </div>

                  <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
                    <span className="text-muted">{d.method === "direct" ? "مبلغ قابل پرداخت (کامل)" : "پرداخت امروز (قسط اول)"}</span>
                    <span className="font-display text-[30px] text-espresso">{toman(firstPay)}</span>
                  </div>
                  <p className="mt-2 flex items-center gap-2 text-[12px] text-muted">
                    <Lock size={13} />
                    {d.method === "direct"
                      ? "پرداخت کامل و آنلاین · بدون بیعانه"
                      : `مبلغ کل ${toman(service.price)} · ${faNum(METHODS[d.method].count)} قسط ماهانه با ${METHODS[d.method].title}`}
                  </p>
                </Step>
              )}

              {/* desktop actions */}
              <div className="mt-12 hidden items-center justify-between lg:flex">
                {step > 1 ? (
                  <button type="button" onClick={() => go(step - 1)} className="flex min-h-12 items-center gap-2 text-wine">
                    <ArrowRight size={16} /> مرحله قبل
                  </button>
                ) : (
                  <span />
                )}
                <button type="button" onClick={next} aria-disabled={!canNext} className="btn btn-primary min-w-60">
                  {cta} <ArrowLeft className="arrow" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Desktop summary */}
        <aside className="hidden lg:col-span-4 lg:col-start-9 lg:block">
          <div className="sticky top-[calc(var(--header-h)+32px)]">
            {service ? (
              <>
                <Figure name={service.image} ratio="4/5" sizes="30vw" reveal={false} set={photoSet} />
                <div className="mt-6">
                  <p className="t-eyebrow text-gold-ink">Your Booking</p>
                  <p className="mt-3 font-display text-[30px] text-wine">{service.title}</p>
                  <dl className="mt-4 space-y-2 text-[14px]">
                    <Row k="متخصص" v={assignedSp?.name ?? (d.specialist === ANY_SPECIALIST ? "فرقی ندارد" : "—")} />
                    <Row k="تاریخ" v={d.date ? faDateLong(d.date) : "—"} />
                    <Row k="ساعت" v={d.time ? faTime(d.time) : "—"} />
                    <Row k="مدت" v={durationLabel(service.durationMin)} />
                  </dl>
                  <div className="mt-5 flex items-baseline justify-between border-t border-line pt-4">
                    <span className="text-muted">مبلغ</span>
                    <span className="text-[20px]">{toman(service.price)}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="border border-line p-8 text-center">
                <p className="t-latin-italic text-[40px] text-champagne">Vida</p>
                <p className="mt-3 text-[14px] text-muted">خدمت مورد نظر خود را انتخاب کنید.</p>
              </div>
            )}
            <p className="mt-8 text-[13px] leading-7 text-muted">
              سؤالی دارید؟{" "}
              <a href={`tel:${site.phone}`} className="text-wine">
                {faNum(site.phone)}
              </a>
            </p>
          </div>
        </aside>
      </div>

      {/* Mobile action bar */}
      <div className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-line bg-ivory/96 px-4 pt-3 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={() => go(step - 1)}
              className="flex size-12 flex-none items-center justify-center border border-line text-wine"
              aria-label="مرحله قبل"
            >
              <ArrowRight size={18} />
            </button>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] text-muted">
              {service ? service.title : "انتخاب خدمت"}
              {d.time ? ` · ${faTime(d.time)}` : ""}
            </p>
            <p className="truncate text-[15px]">{service ? toman(service.price) : "—"}</p>
          </div>
          <button
            type="button"
            onClick={next}
            aria-disabled={!canNext}
            className="btn btn-primary min-h-12 flex-none rounded-full px-7 text-[15px]"
          >
            {step === 5 ? "پرداخت" : "ادامه"} <ArrowLeft className="arrow" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── small pieces ─────────────────────────────────────────── */

function Step({ title, eyebrow, children }: { title: string; eyebrow: string; children: React.ReactNode }) {
  return (
    <section className="anim-rise">
      <p className="t-eyebrow text-gold-ink">{eyebrow}</p>
      <h1 className="t-h2 mt-4 text-wine">{title}</h1>
      <div className="mt-10">{children}</div>
    </section>
  );
}

function Radio({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden
      className={`flex size-6 items-center justify-center rounded-full border transition-colors ${on ? "border-wine bg-wine text-ivory" : "border-line"}`}
    >
      {on && <Check size={13} />}
    </span>
  );
}

function Choice({
  on,
  onClick,
  title,
  sub,
  mark,
  wide,
}: {
  on: boolean;
  onClick: () => void;
  title: string;
  sub: string;
  mark: string;
  wide?: boolean;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={on}
      onClick={onClick}
      className={`flex min-h-24 items-center gap-5 border p-5 text-right transition-colors duration-300 ${wide ? "sm:col-span-2" : ""} ${
        on ? "border-wine bg-cream" : "border-line hover:border-wine/40"
      }`}
    >
      <span
        className={`flex size-14 flex-none items-center justify-center rounded-full font-display text-[22px] ${on ? "bg-wine text-champagne-light" : "bg-nude text-wine"}`}
      >
        {mark}
      </span>
      <span className="flex-1">
        <span className="block font-display text-[22px] text-espresso">{title}</span>
        <span className="block text-[13px] text-muted">{sub}</span>
      </span>
      <Radio on={on} />
    </button>
  );
}

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string | null;
  hint?: string;
  children: (id: string) => React.ReactNode;
}) {
  const id = `f-${label.replace(/\s/g, "")}`;
  return (
    <div>
      <label htmlFor={id} className="t-label block">
        {label}
      </label>
      {children(id)}
      {error ? (
        <p className="mt-2 text-[13px] text-wine">{error}</p>
      ) : hint ? (
        <p className="mt-2 text-[12px] text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{k}</dt>
      <dd className="text-left">{v}</dd>
    </div>
  );
}

function Summary({
  service,
  specialist,
  date,
  time,
  name,
  phone,
  compact,
}: {
  service: string;
  specialist?: string;
  date: string | null;
  time: string | null;
  name?: string;
  phone?: string;
  compact?: boolean;
}) {
  const base = useDemoBase();
  const rows: [string, string][] = [
    ["خدمت", service],
    ["متخصص", specialist ?? "—"],
    ["تاریخ", date ? faDateLong(date) : "—"],
    ["ساعت", time ? faTime(time) : "—"],
  ];
  if (name) rows.push(["نام", name]);
  if (phone) rows.push(["موبایل", faNum(normalizeDigits(phone))]);
  return (
    <dl className={`grid grid-cols-2 gap-x-6 border-y border-line ${compact ? "gap-y-4 py-5 text-[14px]" : "gap-y-6 py-8"}`}>
      {rows.map(([k, v]) => (
        <div key={k}>
          <dt className="t-label">{k}</dt>
          <dd className={`mt-1 ${compact ? "" : "font-display text-[22px] leading-snug"}`}>{v}</dd>
        </div>
      ))}
      <div className="col-span-2 -mt-1">
        <Link href={`${base}/booking?step=1`} className="text-[12px] text-muted underline underline-offset-4">
          ویرایش انتخاب‌ها
        </Link>
      </div>
    </dl>
  );
}

"use client";

import Image from "next/image";
import { CardIcon } from "@/components/ui/Icons";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getMedia3 } from "@/data/media3";
import { ANY_SPECIALIST } from "@/data/specialists";
import { site } from "@/data/site";
import { canBook, dayStatus, mergedSlots, specialistSlots, type Slot } from "@/lib/booking/slots";
import { buildPlan, METHODS, type PaymentMethod } from "@/lib/booking/payment";
import { createBooking, useDemo, useHydrated } from "@/lib/store/store";
import { addDays, durationLabel, faDateLong, faDayMonth, faNum, faTime, faWeekdayShort, isValidMobile, normalizeDigits, todayKey, toMin, toman } from "@/lib/format";
import { D3 } from "@/lib/demo";

/* Demo 3 booking — one-page wizard in the paper & espresso language:
   arch thumbnails, arch-numbered steps, ruled "ledger" summary.
   Same engine as the other demos (slots, buffer, store). */

type Draft = {
  service: string | null;
  specialist: string | null;
  date: string | null;
  time: string | null;
  assigned: string | null;
  name: string;
  phone: string;
  notes: string;
  agreed: boolean;
  method: PaymentMethod;
};
const EMPTY: Draft = { service: null, specialist: null, date: null, time: null, assigned: null, name: "", phone: "", notes: "", agreed: false, method: "direct" };
const KEY = "vida-booking-draft/demo-3";
const DAYS = 14;

export function Booking3() {
  const router = useRouter();
  const params = useSearchParams();
  const s = useDemo();
  const hydrated = useHydrated();
  const [d, setD] = useState<Draft>(EMPTY);
  const [restored, setRestored] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sheet, setSheet] = useState(false);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    let saved = EMPTY;
    try {
      saved = { ...EMPTY, ...JSON.parse(sessionStorage.getItem(KEY) || "{}") };
    } catch {}
    const svc = params.get("service");
    if (svc && svc !== saved.service) saved = { ...EMPTY, service: svc, name: saved.name, phone: saved.phone };
    // sessionStorage exists only after hydration
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
  }, [d, restored]);

  const patch = (p: Partial<Draft>) => setD((x) => ({ ...x, ...p }));
  const offered = s.services;
  const service = offered.find((x) => x.slug === d.service) ?? null;
  const eligible = useMemo(
    () => s.specialists.filter((sp) => sp.active && (!service || sp.specialties.includes(service.slug))),
    [s.specialists, service],
  );
  const pool = useMemo(() => (d.specialist === ANY_SPECIALIST ? eligible : eligible.filter((sp) => sp.id === d.specialist)), [d.specialist, eligible]);

  const slotsFor = useCallback(
    (date: string): Slot[] => {
      if (!service || !pool.length) return [];
      const ctx = { date, durationMin: service.durationMin, bookings: s.bookings, blocks: s.blocks, bufferMin: s.settings.bufferMin };
      return pool.length === 1 ? specialistSlots(pool[0], ctx) : mergedSlots(pool, ctx);
    },
    [service, pool, s.bookings, s.blocks, s.settings.bufferMin],
  );
  const days = useMemo(() => Array.from({ length: DAYS }, (_, i) => addDays(todayKey(), i)).map((k) => ({ k, ...dayStatus(slotsFor(k)) })), [slotsFor]);
  const slots = d.date ? slotsFor(d.date) : [];
  const assignedSp = s.specialists.find((x) => x.id === (d.assigned ?? d.specialist));

  const done = [
    !!service,
    !!d.specialist && (d.specialist === ANY_SPECIALIST || eligible.some((x) => x.id === d.specialist)),
    !!d.date && !!d.time,
    d.name.trim().length >= 3 && isValidMobile(d.phone),
    d.agreed,
  ];
  const active = Math.max(0, done.findIndex((x) => !x));
  const allDone = done.every(Boolean);
  const progress = done.filter(Boolean).length / done.length;

  const focusNext = (i: number) =>
    window.setTimeout(() => refs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);

  function submit() {
    if (!allDone || !service) return;
    const spId = d.assigned ?? d.specialist!;
    const sp = s.specialists.find((x) => x.id === spId)!;
    const ok = canBook(sp, d.time!, { date: d.date!, durationMin: service.durationMin, bookings: s.bookings, blocks: s.blocks, bufferMin: s.settings.bufferMin });
    if (!ok) {
      setError("این زمان همین حالا رزرو شد؛ لطفاً زمان دیگری انتخاب کنید.");
      patch({ time: null });
      focusNext(2);
      return;
    }
    const b = createBooking({
      serviceSlug: service.slug,
      specialistId: spId,
      date: d.date!,
      start: d.time!,
      customer: { name: d.name.trim(), phone: normalizeDigits(d.phone).replace(/\D/g, "") },
      notes: d.notes.trim() || undefined,
      source: "online",
      status: "awaiting_payment",
    });
    router.push(`${D3}/booking/pay?id=${b.id}&method=${d.method}`);
  }

  if (!hydrated || !restored) return <div className="h-[80vh]" />;
  const plan = service ? buildPlan(service.price, d.method) : null;

  const sec = { active, done, setRef: (i: number, el: HTMLElement | null) => (refs.current[i] = el) };

  return (
    <div className="mx-auto max-w-[1320px] px-4 pb-32 pt-4 lg:px-8 lg:pb-20">
      {/* top progress */}
      <div className="sticky top-0 z-20 -mx-4 border-b border-line bg-ivory/95 px-4 py-3 lg:-mx-8 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[13px] text-charcoal">
            <span className="font-medium text-espresso">رزرو نوبت</span> · مرحله {faNum(Math.min(active + 1, 5))} از ۵
          </p>
          <Link href={D3} className="text-[12px] text-muted hover:text-espresso">
            انصراف
          </Link>
        </div>
        <div className="mt-2 h-px overflow-hidden bg-line-strong">
          <div className="h-full bg-espresso transition-[width] duration-700" style={{ width: `${Math.max(6, progress * 100)}%` }} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="min-w-0 space-y-4 lg:col-span-8">
          {/* 1 service */}
          <Section {...sec} i={0} title="چه خدمتی می‌خواهید؟" hint="هر خدمت با مشاوره و طراحی روی پوست آغاز می‌شود.">
            <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 lg:grid-cols-5">
              {offered.map((x) => {
                const m = getMedia3(x.image);
                const on = d.service === x.slug;
                return (
                  <button
                    key={x.slug}
                    type="button"
                    aria-pressed={on}
                    onClick={() => {
                      patch({ service: x.slug, specialist: null, date: null, time: null, assigned: null });
                      focusNext(1);
                    }}
                    className="group text-right"
                  >
                    <span className={`relative block aspect-[3/4] overflow-hidden rounded-b-2xl rounded-t-full ring-2 ring-offset-2 ring-offset-surface transition-colors ${on ? "ring-champagne" : "ring-transparent group-hover:ring-line-strong"}`}>
                      <Image src={m.src} alt="" fill sizes="(min-width:1024px) 20vw, 45vw" className="object-cover transition-transform duration-700 group-hover:scale-105" style={{ objectPosition: m.focal }} placeholder={m.blur ? "blur" : "empty"} blurDataURL={m.blur} />
                    </span>
                    <span className="mt-2 block px-1">
                      <span className="block text-[14px] font-medium text-espresso">{x.title}</span>
                      <span className="block text-[11px] text-charcoal">
                        {durationLabel(x.durationMin)} · {toman(x.price)}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Section>

          {/* 2 specialist */}
          <Section {...sec} i={1} title="متخصص" hint="اگر فرقی ندارد، اولین زمان آزاد همه متخصص‌ها را می‌بینید.">
            <div className="flex flex-wrap gap-2">
              {[{ id: ANY_SPECIALIST, name: "فرقی ندارد", title: "سریع‌ترین زمان" }, ...eligible.map((x) => ({ id: x.id, name: x.name, title: x.title }))].map((x) => {
                const on = d.specialist === x.id;
                return (
                  <button
                    key={x.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => {
                      patch({ specialist: x.id, date: null, time: null, assigned: null });
                      focusNext(2);
                    }}
                    className={`flex items-center gap-3 rounded-full border py-1.5 pe-5 ps-1.5 text-right transition-colors ${on ? "border-espresso bg-espresso text-surface" : "border-line hover:border-line-strong"}`}
                  >
                    <span className={`flex size-10 items-center justify-center rounded-full text-[14px] ${on ? "bg-surface/15" : "bg-cream text-accent-deep"}`}>
                      {x.id === ANY_SPECIALIST ? "✦" : faNum(x.name.replace(/\D/g, "") || "•")}
                    </span>
                    <span>
                      <span className="block text-[14px]">{x.name}</span>
                      <span className={`block text-[11px] ${on ? "text-surface/70" : "text-muted"}`}>{x.title}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Section>

          {/* 3 time */}
          <Section {...sec} i={2} title="روز و ساعت" hint={`فاصله ${faNum(s.settings.bufferMin)} دقیقه‌ای بین نوبت‌ها رعایت می‌شود.`}>
            <div className="snap-x -mx-1 flex gap-2 overflow-x-auto px-1 pb-2 lg:mx-0 lg:grid lg:grid-cols-7 lg:overflow-visible lg:px-0 lg:pb-0">
              {days.map(({ k, status, available }) => {
                const on = d.date === k;
                const [day, month] = faDayMonth(k).split(" ");
                return (
                  <button
                    key={k}
                    type="button"
                    disabled={status === "closed"}
                    aria-pressed={on}
                    onClick={() => patch({ date: k, time: null, assigned: null })}
                    className={`flex w-[68px] shrink-0 flex-col items-center rounded-2xl border py-3 transition-colors disabled:opacity-40 lg:w-auto ${
                      on ? "border-espresso bg-espresso text-surface" : "border-line hover:border-line-strong"
                    }`}
                  >
                    <span className={`text-[11px] ${on ? "text-surface/70" : "text-muted"}`}>{faWeekdayShort(k)}</span>
                    <span className="mt-1 text-[22px] font-medium leading-none">{day}</span>
                    <span className={`mt-1 text-[10px] ${on ? "text-surface/70" : "text-muted"}`}>{month}</span>
                    <span
                      className={`mt-2 size-1.5 rounded-full ${status === "available" ? "bg-success" : status === "full" ? "bg-danger" : "bg-line-strong"}`}
                      title={status === "available" ? `${faNum(available)} زمان آزاد` : status === "full" ? "تکمیل" : "تعطیل"}
                    />
                  </button>
                );
              })}
            </div>
            <div className="mt-2 flex flex-wrap gap-4 text-[11px] text-muted">
              <span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-success" /> زمان آزاد</span>
              <span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-danger" /> تکمیل</span>
              <span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-line-strong" /> تعطیل</span>
            </div>
            {d.date && (
              <div className="mt-6 space-y-5">
                {[
                  ["صبح", slots.filter((x) => toMin(x.start) < 13 * 60)],
                  ["بعدازظهر", slots.filter((x) => toMin(x.start) >= 13 * 60)],
                ].map(([label, list]) =>
                  (list as Slot[]).length ? (
                    <div key={label as string}>
                      <p className="mb-2 text-[12px] text-muted">{label as string}</p>
                      <div className="flex flex-wrap gap-2">
                        {(list as Slot[]).map((sl) => {
                          const on = d.time === sl.start;
                          const ok = sl.status === "available";
                          return (
                            <button
                              key={sl.start}
                              type="button"
                              disabled={!ok}
                              aria-pressed={on}
                              aria-label={`${faTime(sl.start)} ${ok ? "آزاد" : sl.status === "booked" ? "رزرو شده" : "بسته"}`}
                              onClick={() => {
                                patch({ time: sl.start, assigned: d.specialist === ANY_SPECIALIST ? sl.specialistId ?? null : null });
                                focusNext(3);
                              }}
                              className={`min-h-11 rounded-full border px-4 text-[14px] tabular-nums transition-colors ${
                                on
                                  ? "border-espresso bg-espresso text-surface"
                                  : ok
                                    ? "border-line-strong bg-cream hover:border-champagne"
                                    : sl.status === "booked"
                                      ? "border-transparent bg-cream text-faint line-through"
                                      : "border-transparent bg-transparent text-faint"
                              }`}
                            >
                              {faTime(sl.start)}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null,
                )}
                {!slots.length && <p className="text-[13px] text-muted">در این روز زمانی ثبت نشده است.</p>}
              </div>
            )}
            {error && <p className="mt-4 rounded-2xl bg-danger-soft px-4 py-3 text-[13px] text-danger">{error}</p>}
          </Section>

          {/* 4 details */}
          <Section {...sec} i={3} title="اطلاعات شما" hint="کد رزرو و یادآوری به همین شماره پیامک می‌شود.">
            <div className="grid gap-3 sm:grid-cols-2">
              <Float label="نام و نام خانوادگی" value={d.name} onChange={(v) => patch({ name: v })} />
              <Float label="شماره موبایل" value={d.phone} onChange={(v) => patch({ phone: v })} ltr inputMode="tel" error={d.phone.length > 3 && !isValidMobile(d.phone) ? "شماره موبایل معتبر نیست" : undefined} />
              <div className="sm:col-span-2">
                <Float label="توضیحات (اختیاری)" value={d.notes} onChange={(v) => patch({ notes: v })} />
              </div>
            </div>
          </Section>

          {/* 5 payment */}
          <Section {...sec} i={4} title="روش پرداخت و تأیید" hint="پرداخت کامل یا اقساطی؛ بدون کارمزد اضافه در نسخه دمو.">
            {service && (
              <div className="grid gap-3 sm:grid-cols-3">
                {(Object.keys(METHODS) as PaymentMethod[]).map((k) => {
                  const p = buildPlan(service.price, k);
                  const on = d.method === k;
                  return (
                    <button
                      key={k}
                      type="button"
                      aria-pressed={on}
                      onClick={() => patch({ method: k })}
                      className={`flex flex-col rounded-2xl border p-4 text-right transition-colors ${on ? "border-espresso ring-1 ring-espresso" : "border-line hover:border-line-strong"}`}
                    >
                      <span className="flex items-center justify-between">
                        <span className="flex size-9 items-center justify-center rounded-xl text-[14px] font-bold text-surface" style={{ background: k === "direct" ? "var(--color-espresso)" : METHODS[k].color }}>
                          {k === "direct" ? <CardIcon size={18} /> : k === "snapppay" ? "S" : "D"}
                        </span>
                        <span className={`size-4 rounded-full border ${on ? "border-[5px] border-espresso" : "border-line-strong"}`} />
                      </span>
                      <span className="mt-4 text-[15px] font-medium">{METHODS[k].title}</span>
                      <span className="mt-1 text-[11px] leading-5 text-muted">{METHODS[k].note}</span>
                      <span className="mt-4 flex items-end gap-1" aria-hidden>
                        {p.installments.map((i) => (
                          <span key={i.n} className={`h-6 flex-1 rounded-md ${i.n === 1 ? "bg-champagne" : "bg-cream"}`} />
                        ))}
                      </span>
                      <span className="mt-2 text-[12px]">
                        {k === "direct" ? "امروز" : "قسط اول"}: <b className="font-medium">{toman(p.installments[0].amount)}</b>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
            <div className="mt-5 rounded-2xl bg-cream p-4 text-[13px] leading-7 text-charcoal">
              لغو تا ۲۴ ساعت پیش از نوبت: {faNum(s.settings.cancellationFeePercent)}٪ کسر و <b>۸۰٪ بازگشت</b> · کمتر از ۲۴ ساعت: بدون بازگشت وجه ·
              تغییر زمان فقط تلفنی{" "}
              <a href={`tel:${site.phone}`} className="underline underline-offset-4" dir="ltr">
                {faNum(site.phone)}
              </a>
            </div>
            <label className="mt-4 flex cursor-pointer items-center gap-3 text-[14px]">
              <input type="checkbox" className="check" checked={d.agreed} onChange={(e) => patch({ agreed: e.target.checked })} />
              قوانین رزرو و لغو را می‌پذیرم.
            </label>
          </Section>
        </div>

        {/* summary */}
        <aside className="hidden lg:col-span-4 lg:block">
          <div className="sticky top-24">
            <Summary d={d} service={service} spName={assignedSp?.name ?? (d.specialist === ANY_SPECIALIST ? "فرقی ندارد" : undefined)} plan={plan} allDone={allDone} onSubmit={submit} />
          </div>
        </aside>
      </div>

      {/* mobile bottom bar + sheet */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-ivory/95 p-3 lg:hidden">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setSheet(true)} className="min-w-0 flex-1 text-right">
            <span className="block truncate text-[13px] font-medium">{service?.title ?? "خدمتی انتخاب نشده"}</span>
            <span className="block text-[11px] text-muted">
              {plan ? `${d.method === "direct" ? "پرداخت" : "قسط اول"} ${toman(plan.installments[0].amount)}` : "خلاصه رزرو"} · جزئیات ⌃
            </span>
          </button>
          <button type="button" disabled={!allDone} onClick={submit} className="btn btn-primary whitespace-nowrap px-6 disabled:opacity-40">
            پرداخت
          </button>
        </div>
      </div>
      {sheet && (
        <div className="fixed inset-0 z-40 flex items-end bg-espresso/30 lg:hidden" onClick={() => setSheet(false)}>
          <div className="w-full rounded-t-[28px] bg-surface p-4 pb-8" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="خلاصه رزرو">
            <span className="mx-auto mb-4 block h-1 w-10 rounded-full bg-line-strong" />
            <Summary d={d} service={service} spName={assignedSp?.name} plan={plan} allDone={allDone} onSubmit={submit} />
          </div>
        </div>
      )}
    </div>
  );
}

function Section({
  i,
  title,
  hint,
  children,
  active,
  done,
  setRef,
}: {
  i: number;
  title: string;
  hint?: string;
  children: React.ReactNode;
  active: number;
  done: boolean[];
  setRef: (i: number, el: HTMLElement | null) => void;
}) {
  const locked = i > active && !done[i];
  return (
    <section
      ref={(el) => {
        setRef(i, el);
      }}
      aria-labelledby={`b4-s${i}`}
      className={`scroll-mt-28 rounded-[28px] border bg-surface/80 p-5 transition-[border-color,opacity] duration-500 sm:p-7 ${
        i === active ? "border-espresso/40" : "border-line"
      } ${locked ? "pointer-events-none opacity-40" : ""}`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-t-full rounded-b-md text-[15px] ${
            done[i] ? "bg-espresso text-surface" : i === active ? "bg-champagne text-surface" : "bg-cream text-muted"
          }`}
        >
          {done[i] ? "✓" : faNum(i + 1)}
        </span>
        <div>
          <h2 id={`b4-s${i}`} className="text-[21px]">
            {title}
          </h2>
          {hint && <p className="text-[12px] text-muted">{hint}</p>}
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Summary({
  d,
  service,
  spName,
  plan,
  allDone,
  onSubmit,
}: {
  d: Draft;
  service: { title: string; image: string; durationMin: number; price: number } | null;
  spName?: string;
  plan: ReturnType<typeof buildPlan> | null;
  allDone: boolean;
  onSubmit: () => void;
}) {
  const m = service ? getMedia3(service.image) : null;
  const book = getMedia3("book");
  return (
    <div className="overflow-hidden rounded-[28px] border border-line bg-surface">
      <div className="px-5 pt-6">
        <div className="relative mx-auto aspect-[3/4] w-2/5 overflow-hidden rounded-t-full bg-cream">
          <Image src={(m ?? book).src} alt="" fill sizes="140px" className="object-cover" style={{ objectPosition: (m ?? book).focal }} />
        </div>
      </div>
      <p className="nue-display px-5 pt-5 text-center text-[19px]">خلاصه رزرو</p>
      <dl className="mx-5 mt-3 divide-y divide-line border-y border-line text-[13px]">
        {[
          ["خدمت", service?.title],
          ["مدت", service ? durationLabel(service.durationMin) : undefined],
          ["متخصص", spName],
          ["زمان", d.date && d.time ? `${faDateLong(d.date)} · ${faTime(d.time)}` : undefined],
          ["نام", d.name || undefined],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 py-2.5">
            <dt className="text-muted">{k}</dt>
            <dd className={`text-left ${v ? "text-espresso" : "text-faint"}`}>{v ?? "-"}</dd>
          </div>
        ))}
      </dl>
      {plan && service && (
        <div className="border-t border-line p-5">
          <div className="flex items-baseline justify-between">
            <span className="text-[13px] text-muted">{plan.method === "direct" ? "مبلغ کل" : `${METHODS[plan.method].title} · ${faNum(plan.installments.length)} قسط`}</span>
            <span className="text-[20px] font-medium">{toman(service.price)}</span>
          </div>
          {plan.method !== "direct" && (
            <ol className="mt-3 divide-y divide-line border-y border-line text-[12px]">
              {plan.installments.map((i) => (
                <li key={i.n} className="flex justify-between py-2">
                  <span className={i.n === 1 ? "font-medium text-espresso" : "text-charcoal"}>
                    قسط {faNum(i.n)} · {i.n === 1 ? "امروز" : faDateLong(i.due)}
                  </span>
                  <span>{toman(i.amount)}</span>
                </li>
              ))}
            </ol>
          )}
          <button type="button" disabled={!allDone} onClick={onSubmit} className="btn btn-primary mt-5 w-full disabled:opacity-40">
            {plan.method === "direct" ? `پرداخت ${toman(plan.installments[0].amount)}` : `پرداخت قسط اول · ${toman(plan.installments[0].amount)}`}
          </button>
          {!allDone && <p className="mt-2 text-center text-[11px] text-muted">برای ادامه همه مراحل را کامل کنید.</p>}
        </div>
      )}
    </div>
  );
}

function Float({
  label,
  value,
  onChange,
  ltr,
  inputMode,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  ltr?: boolean;
  inputMode?: "tel" | "text";
  error?: string;
}) {
  const id = `f4-${label.length}-${label.charCodeAt(0)}`;
  return (
    <div>
      <div className={`relative rounded-2xl border bg-cream transition-colors focus-within:border-champagne focus-within:bg-surface ${error ? "border-danger" : "border-line-strong"}`}>
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder=" "
          inputMode={inputMode}
          dir={ltr ? "ltr" : undefined}
          className={`peer w-full bg-transparent px-4 pb-2.5 pt-6 text-[15px] outline-none ${ltr ? "text-left" : ""}`}
        />
        <label
          htmlFor={id}
          className="pointer-events-none absolute right-4 top-4 text-[14px] text-muted transition-[top,font-size] peer-focus:top-2 peer-focus:text-[11px] peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[11px]"
        >
          {label}
        </label>
      </div>
      {error && <p className="mt-1 text-[11px] text-danger">{error}</p>}
    </div>
  );
}

import { test } from "node:test";
import assert from "node:assert/strict";
import type { Booking, Specialist, TimeBlock } from "../src/data/types";
import { canBook, dayStatus, hasConflict, mergedSlots, specialistSlots } from "../src/lib/booking/slots";
import { refundQuote } from "../src/lib/booking/policy";
import { defaultSettings } from "../src/data/site";

// 2030-01-07 is a Monday (well in the future, so "now" never cuts slots)
const DATE = "2030-01-07";
const NOW = new Date(2029, 11, 1, 9, 0);

const sp = (id: string, open = "10:00", close = "19:00"): Specialist => ({
  id,
  name: id,
  title: "",
  bio: "",
  specialties: ["microblading"],
  photo: null,
  documents: [],
  hours: [0, 1, 2, 3, 4, 5, 6].map((day) => (day === 5 ? { day, open: null, close: null } : { day, open, close })),
  isPlaceholder: true,
  active: true,
});

const booking = (id: string, specialistId: string, start: string, durationMin: number, status: Booking["status"] = "confirmed"): Booking => ({
  id,
  serviceSlug: "microblading",
  specialistId,
  date: DATE,
  start,
  durationMin,
  customer: { name: "t", phone: "09000000000" },
  price: 1,
  paid: 1,
  refunded: 0,
  status,
  source: "online",
  createdAt: NOW.toISOString(),
  history: [],
});

const ctx = (bookings: Booking[] = [], blocks: TimeBlock[] = [], durationMin = 75) => ({
  date: DATE,
  durationMin,
  bookings,
  blocks,
  bufferMin: 15,
  now: NOW,
});

test("empty day chains slots with a 15-minute buffer", () => {
  const s = specialistSlots(sp("a"), ctx());
  assert.deepEqual(
    s.map((x) => x.start),
    ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30"],
  );
  assert.ok(s.every((x) => x.status === "available"));
});

test("a booking shows as booked and the next slot starts after its buffer", () => {
  const s = specialistSlots(sp("a"), ctx([booking("b1", "a", "10:00", 75)]));
  assert.equal(s[0].start, "10:00");
  assert.equal(s[0].status, "booked");
  assert.equal(s[1].start, "11:30");
  assert.equal(s[1].status, "available");
});

test("no slot ever overlaps a booking + buffer", () => {
  const b = booking("b1", "a", "12:10", 90); // 12:10–13:40, buffer until 13:55
  const s = specialistSlots(sp("a"), ctx([b])).filter((x) => x.status === "available");
  for (const x of s) {
    const [h, m] = x.start.split(":").map(Number);
    const start = h * 60 + m;
    const end = start + 75;
    assert.ok(end + 15 <= 12 * 60 + 10 || start >= 13 * 60 + 40 + 15, `${x.start} overlaps`);
  }
});

test("cancelled bookings free their time", () => {
  const s = specialistSlots(sp("a"), ctx([booking("b1", "a", "10:00", 75, "cancelled")]));
  assert.equal(s[0].status, "available");
});

test("time blocks close the affected range; whole-day blocks close the day", () => {
  const blk: TimeBlock = { id: "x", specialistId: "a", date: DATE, start: "10:00", end: "13:00" };
  const s = specialistSlots(sp("a"), ctx([], [blk]));
  assert.equal(s[0].status, "closed");
  assert.equal(s[1].start, "13:00");
  const day: TimeBlock = { id: "y", specialistId: "all", date: DATE, start: null, end: null };
  assert.equal(specialistSlots(sp("a"), ctx([], [day])).length, 0);
  assert.equal(dayStatus([]).status, "closed");
});

test("canBook rejects a taken slot (one customer per slot)", () => {
  const c = ctx([booking("b1", "a", "10:00", 75)]);
  assert.equal(canBook(sp("a"), "10:00", c), false);
  assert.equal(canBook(sp("a"), "11:30", c), true);
});

test("'any specialist' merges availability — available wins", () => {
  const c = ctx([booking("b1", "a", "10:00", 75)]);
  const s = mergedSlots([sp("a"), sp("b")], c);
  const ten = s.find((x) => x.start === "10:00")!;
  assert.equal(ten.status, "available");
  assert.equal(ten.specialistId, "b");
});

test("manual bookings: conflict check respects the buffer", () => {
  const c = { bookings: [booking("b1", "a", "10:00", 60)], blocks: [], bufferMin: 15 };
  assert.equal(hasConflict("a", DATE, "11:05", 60, c), true); // inside buffer
  assert.equal(hasConflict("a", DATE, "11:15", 60, c), false);
});

test("cancellation policy: ≥24h → 80% refund, <24h → none", () => {
  const b = { date: "2030-01-07", start: "10:00", paid: 1_000_000 };
  const early = refundQuote(b, defaultSettings, new Date(2030, 0, 5, 10, 0));
  assert.equal(early.eligible, true);
  assert.equal(early.refund, 800_000);
  const late = refundQuote(b, defaultSettings, new Date(2030, 0, 7, 8, 0));
  assert.equal(late.eligible, false);
  assert.equal(late.refund, 0);
});

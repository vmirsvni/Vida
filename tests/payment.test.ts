import { test } from "node:test";
import assert from "node:assert/strict";
import { buildPlan, nextDue, paidOf, remainingOf } from "../src/lib/booking/payment";

test("direct payment is a single installment of the full price", () => {
  const p = buildPlan(3_900_000, "direct", new Date(2026, 0, 15));
  assert.equal(p.installments.length, 1);
  assert.equal(p.installments[0].amount, 3_900_000);
});

test("SnappPay splits into 4 monthly installments that add up to the price", () => {
  const p = buildPlan(4_250_000, "snapppay", new Date(2026, 0, 15));
  assert.equal(p.installments.length, 4);
  assert.equal(p.installments.reduce((t, i) => t + i.amount, 0), 4_250_000);
  assert.deepEqual(
    p.installments.map((i) => i.due),
    ["2026-01-15", "2026-02-15", "2026-03-15", "2026-04-15"],
  );
  // equal parts rounded to 1,000; the first absorbs the remainder
  assert.equal(p.installments[1].amount % 1000, 0);
  assert.ok(p.installments[0].amount >= p.installments[1].amount);
});

test("paid / remaining / next due follow the paid installments", () => {
  const p = buildPlan(4_000_000, "digipay", new Date(2026, 5, 1));
  p.installments[0].paidAt = "2026-06-01T10:00:00Z";
  assert.equal(paidOf(p), 1_000_000);
  assert.equal(remainingOf(p), 3_000_000);
  assert.equal(nextDue(p)?.n, 2);
});

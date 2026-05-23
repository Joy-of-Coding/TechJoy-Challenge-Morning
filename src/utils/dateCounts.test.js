import { afterEach, describe, it, expect, vi } from "vitest";
import { countLastNDays, countWeeklyItems } from "./dateCounts";

describe("dateCounts utils", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("counts date strings in the last 7 days", () => {
    const today = new Date().toDateString();
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 10);

    const result = countWeeklyItems([today, oldDate.toDateString()]);
    expect(result).toBe(1);
  });

  it("counts objects with date field", () => {
    const inRange = new Date().toDateString();
    const outRange = new Date();
    outRange.setDate(outRange.getDate() - 8);

    const result = countWeeklyItems([
      { date: inRange },
      { date: outRange.toDateString() },
      { value: 3 },
    ]);

    expect(result).toBe(1);
  });

  it("supports custom day windows", () => {
    const date = new Date();
    date.setDate(date.getDate() - 3);

    expect(countLastNDays([date.toDateString()], 2)).toBe(0);
    expect(countLastNDays([date.toDateString()], 4)).toBe(1);
  });

  it("includes dates that fall exactly on the day boundary", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-23T12:00:00"));

    expect(countWeeklyItems(["Sat May 16 2026"])).toBe(1);
  });
});

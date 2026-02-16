import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { sortEventsByDate, classifyEvents, type Event } from "./eventUtils.ts";

function createEvent(id: number, date: string): Event & { id: number } {
  return {
    id,
    data: {
      name: `イベント${id}`,
      date,
      url: "https://example.com",
      location: "会場",
      locationUrl: "https://example.com/venue",
    },
  };
}

Deno.test("sortEventsByDate - 日付昇順にソートする", () => {
  const events = [
    createEvent(1, "2025-08-21"),
    createEvent(2, "2025-06-15"),
    createEvent(3, "2025-11-07"),
  ];

  const result = sortEventsByDate(events);

  assertEquals(result[0].id, 2);
  assertEquals(result[1].id, 1);
  assertEquals(result[2].id, 3);
});

Deno.test("classifyEvents - 今後と過去を正しく分類する", () => {
  const baseDate = new Date("2025-08-01");
  const events = [
    createEvent(1, "2025-06-15"),
    createEvent(2, "2025-08-21"),
    createEvent(3, "2025-11-07"),
  ];

  const result = classifyEvents(events, baseDate);

  assertEquals(result.past.length, 1);
  assertEquals(result.upcoming.length, 2);
  assertEquals(result.next?.id, 2);
});

Deno.test("classifyEvents - 当日は「今後」に分類される", () => {
  const today = new Date("2025-08-01T00:00:00");
  const events = [createEvent(1, "2025-08-01")];

  const result = classifyEvents(events, today);

  assertEquals(result.upcoming.length, 1);
  assertEquals(result.past.length, 0);
});

Deno.test("classifyEvents - 過去イベントは新しい順", () => {
  const baseDate = new Date("2025-08-01");
  const events = [createEvent(1, "2025-06-15"), createEvent(2, "2025-07-20")];

  const result = classifyEvents(events, baseDate);

  assertEquals(result.past[0].id, 2);
  assertEquals(result.past[1].id, 1);
});

Deno.test("classifyEvents - 今後イベントがない場合nextはundefined", () => {
  const baseDate = new Date("2025-12-01");
  const events = [createEvent(1, "2025-01-01")];

  const result = classifyEvents(events, baseDate);

  assertEquals(result.next, undefined);
});

Deno.test("classifyEvents - 年をまたいでも正しく判定できる", () => {
  const baseDate = new Date("2025-12-31T00:00:00");
  const events = [
    createEvent(1, "2025-06-15"),
    createEvent(3, "2025-10-14"),
    createEvent(2, "2026-02-15"),
  ];

  const result = classifyEvents(events, baseDate);

  assertEquals(result.past.length, 2);
  assertEquals(result.past[0].id, 3);
  assertEquals(result.past[1].id, 1);
  assertEquals(result.upcoming.length, 1);
  assertEquals(result.upcoming[0].id, 2);
});

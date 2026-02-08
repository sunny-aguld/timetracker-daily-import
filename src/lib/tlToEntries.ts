import { TlItem } from "./tlParser";

export type TimeEntryRequest = {
  workItemId: string;
  startTime: string;  // "YYYY-MM-DDTHH:MM:SS"
  finishTime: string; // "YYYY-MM-DDTHH:MM:SS"
  memo?: string;
};

function toMinutes(hhmm: string): number {
  const [hh, mm] = hhmm.split(":").map(Number);
  return hh * 60 + mm;
}

function toDateTime(date: string, hhmm: string): string {
  return `${date}T${hhmm}:00`;
}

/**
 * 厳格版：異常があれば中断（throw）
 * - 作業行（#idあり）→ 次行の時刻で閉じる（次行はmarkerでもOK）
 * - 逆転/同時刻 → エラー中断
 * - 最後の作業行が「次の時刻」で閉じられない → エラー中断
 */
export function buildTimeEntryRequestsFromTlStrict(date: string, items: TlItem[]): TimeEntryRequest[] {
  const reqs: TimeEntryRequest[] = [];

  // 作業行が1つも無いのはエラー（送るものが無い）
  const hasWork = items.some((x) => x.kind === "work" && x.workItemId);
  if (!hasWork) {
    throw new Error("TL format error: no work items found (#id=...).");
  }

  for (let i = 0; i < items.length - 1; i++) {
    const cur = items[i];
    const next = items[i + 1];

    const startM = toMinutes(cur.time);
    const endM = toMinutes(next.time);
    if (endM <= startM) {
      throw new Error(
        `TL time order error at line ${cur.lineNo}: ${cur.time} -> ${next.time} (must be increasing)`
      );
    }

    if (cur.kind === "work" && cur.workItemId) {
      reqs.push({
        workItemId: cur.workItemId,
        startTime: toDateTime(date, cur.time),
        finishTime: toDateTime(date, next.time),
        memo: cur.memo ?? "",
      });
    }
  }

  // 最後が作業行で閉じていない場合はエラー
  const last = items[items.length - 1];
  if (last.kind === "work") {
    throw new Error(
      `TL format error at line ${last.lineNo}: last work item is not closed. Add an end time line (e.g., "16:00 終業").`
    );
  }

  return reqs;
}

import { TlItem } from "./tlParser";

/**
 * TimeTracker 実績工数追加API向けの形（最小）
 * POST /system/users/{userId}/timeEntries
 * 主要フィールド: workItemId, startTime, finishTime, memo
 */
export type TimeEntryRequest = {
  workItemId: string;
  startTime: string; // "YYYY-MM-DDTHH:MM:SS"
  finishTime: string; // "YYYY-MM-DDTHH:MM:SS"
  memo?: string;
};

function toMinutes(hhmm: string): number {
  const [hh, mm] = hhmm.split(":").map(Number);
  return hh * 60 + mm;
}

function toDateTime(date: string, hhmm: string): string {
  // 秒は 00 固定（必要になれば将来拡張）
  return `${date}T${hhmm}:00`;
}

/**
 * TLから API送信用の配列を作る
 * - 作業行のみエントリ生成
 * - finishTime は「次の行の時刻」を使用（次行が終業でもOK）
 */
export function buildTimeEntryRequestsFromTl(date: string, items: TlItem[]): TimeEntryRequest[] {
  const reqs: TimeEntryRequest[] = [];

  for (let i = 0; i < items.length - 1; i++) {
    const cur = items[i];
    const next = items[i + 1];

    if (cur.kind !== "work" || !cur.workItemId) {
      continue;
    }

    // 同時刻/逆転は無視（APIも弾くため）
    const startM = toMinutes(cur.time);
    const endM = toMinutes(next.time);
    if (endM <= startM) {
      continue;
    }

    reqs.push({
      workItemId: cur.workItemId,
      startTime: toDateTime(date, cur.time),
      finishTime: toDateTime(date, next.time),
      memo: cur.memo ?? "",
    });
  }

  return reqs;
}

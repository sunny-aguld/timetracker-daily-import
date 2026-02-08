export type TlItem = {
  time: string; // "HH:MM"
  kind: "work" | "marker";
  taskName?: string; // kind==="work" のとき
  workItemId?: string; // kind==="work" のとき
  memo?: string; // kind==="work" のとき：@task/#id を除いた本文
  raw: string;
};

/**
 * Markdownから ## TL セクションの本文（行配列）を取り出す
 */
export function extractTlLines(markdown: string): string[] {
  const lines = markdown.split(/\r?\n/);

  const startIdx = lines.findIndex((l) => l.trim() === "## TL");
  if (startIdx === -1) {
    return [];
  }

  const tl: string[] = [];
  for (let i = startIdx + 1; i < lines.length; i++) {
    const line = lines[i];

    // 次のセクション開始で終了
    if (/^##\s+/.test(line.trim())) {
      break;
    }

    // 空行はスキップ
    if (line.trim() === "") {
      continue;
    }

    tl.push(line);
  }

  return tl;
}

/**
 * TL行をパース
 * - 作業行: "12:40 ... @task=hoge_実装 #id=12345"
 * - マーカー: "16:00 終業"（時刻のみ）
 */
export function parseTlLines(lines: string[]): TlItem[] {
  const items: TlItem[] = [];

  for (const raw of lines) {
    const line = raw.replace(/\u00A0/g, " ").trim(); // NBSP対策

    const mTime = line.match(/^(\d{2}:\d{2})\s+(.*)$/);
    if (!mTime) {
      continue;
    }

    const time = mTime[1];
    const body = mTime[2];

    const mTask = body.match(/@task=([^\s#]+)/);
    const mId = body.match(/#id=(\d+)/);

    if (mTask && mId) {
      // memo: @task=... と #id=... を除いたもの
      const memo = body
        .replace(/@task=[^\s#]+/g, "")
        .replace(/#id=\d+/g, "")
        .replace(/\s{2,}/g, " ")
        .trim();

      items.push({
        time,
        kind: "work",
        taskName: mTask[1],
        workItemId: mId[1],
        memo,
        raw,
      });
    } else {
      items.push({
        time,
        kind: "marker",
        raw,
      });
    }
  }

  return items;
}

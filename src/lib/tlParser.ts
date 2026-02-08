export type TlLine = {
  lineNo: number; // 1-based in document
  text: string;
};

export type TlItem = {
  time: string; // "HH:MM"
  kind: "work" | "marker";
  workItemId?: string; // kind==="work" のとき必須
  taskName?: string; // あれば（無くてもOK）
  memo?: string; // 本文（@task/#id を除去）
  raw: string;
  lineNo: number;
};

function parseTimeStrict(input: string, lineNo: number): string {
  // HH:MM を厳格に
  const m = input.match(/^(\d{2}):(\d{2})$/);
  if (!m) {
    throw new Error(`TL format error at line ${lineNo}: invalid time "${input}" (expected HH:MM)`);
  }

  const hh = Number(m[1]);
  const mm = Number(m[2]);

  if (Number.isNaN(hh) || Number.isNaN(mm)) {
    throw new Error(`TL format error at line ${lineNo}: invalid time "${input}"`);
  }
  if (hh < 0 || hh > 23 || mm < 0 || mm > 59) {
    throw new Error(`TL format error at line ${lineNo}: time out of range "${input}"`);
  }

  return `${m[1]}:${m[2]}`;
}

/**
 * Markdownから ## TL セクションの本文（行番号付き）を取り出す
 * - 次の "## " 見出しまで
 */
export function extractTlLines(markdown: string): TlLine[] {
  const lines = markdown.split(/\r?\n/);

  const startIdx = lines.findIndex((l) => l.trim() === "## TL");
  if (startIdx === -1) {
    throw new Error('TL format error: section heading "## TL" not found.');
  }

  const tl: TlLine[] = [];
  for (let i = startIdx + 1; i < lines.length; i++) {
    const line = lines[i];

    if (/^##\s+/.test(line.trim())) {
      break;
    }

    if (line.trim() === "") {
      continue;
    }

    tl.push({ lineNo: i + 1, text: line });
  }

  if (tl.length === 0) {
    throw new Error('TL format error: "## TL" section is empty.');
  }

  return tl;
}

/**
 * TL行をパース（厳格）
 * - 時刻形式が壊れていたら中断
 * - 作業行は #id が必須（@task は任意）
 * - marker 行は時刻のみ（終業など）
 */
export function parseTlLinesStrict(lines: TlLine[]): TlItem[] {
  const items: TlItem[] = [];

  for (const l of lines) {
    const line = l.text.replace(/\u00A0/g, " ").trim();

    // 先頭に「時刻 + 半角スペース以降」が必須
    const m = line.match(/^(\S+)\s+(.*)$/);
    if (!m) {
      throw new Error(`TL format error at line ${l.lineNo}: missing body after time`);
    }

    const time = parseTimeStrict(m[1], l.lineNo);
    const body = m[2];

    const mId = body.match(/#id=(\d+)/);
    const mTask = body.match(/@task=([^\s#]+)/);

    // #id があれば作業行。なければ marker 行。
    if (mId) {
      const memo = body
        .replace(/@task=[^\s#]+/g, "")
        .replace(/#id=\d+/g, "")
        .replace(/\s{2,}/g, " ")
        .trim();

      items.push({
        time,
        kind: "work",
        workItemId: mId[1],
        taskName: mTask ? mTask[1] : undefined, // @task は任意
        memo,
        raw: l.text,
        lineNo: l.lineNo,
      });
    } else {
      // marker（終業など）
      items.push({
        time,
        kind: "marker",
        raw: l.text,
        lineNo: l.lineNo,
      });
    }
  }

  return items;
}

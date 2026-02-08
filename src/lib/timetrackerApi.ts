import * as vscode from "vscode";

export type AuthTokenResponse = { token: string };

export type LoginUser = {
  id?: string | number;
  userId?: string | number;
  code?: string;
  name?: string;
};

export type TimeEntryRequest = {
  workItemId: string;
  startTime: string;   // "YYYY-MM-DDTHH:MM:SS"
  finishTime: string;  // "YYYY-MM-DDTHH:MM:SS"
  memo?: string;
};

function getApiBaseUrl(): string {
  const config = vscode.workspace.getConfiguration();
  const base = (config.get<string>("timetrackerDailyImport.apiBaseUrl") ?? "").trim();

  if (!base) {
    throw new Error(
      'timetrackerDailyImport.apiBaseUrl is not set. Set it to something like "https://<server>/<site>/api".'
    );
  }
  return base.replace(/\/+$/, ""); // trim trailing slash
}

async function jsonFetch<T>(
  url: string,
  init: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
  }

  return (await res.json()) as T;
}

export async function issueToken(loginName: string, password: string): Promise<string> {
  const base = getApiBaseUrl();
  const url = `${base}/auth/token`; // POST /auth/token :contentReference[oaicite:2]{index=2}

  const body = { loginName, password };
  const data = await jsonFetch<AuthTokenResponse>(url, {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!data.token) {
    throw new Error("Token not found in response.");
  }

  return data.token;
}

export async function getMe(token: string): Promise<LoginUser> {
  const base = getApiBaseUrl();
  const url = `${base}/system/users/me`; // GET /system/users/me :contentReference[oaicite:3]{index=3}

  return await jsonFetch<LoginUser>(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function postTimeEntry(
  token: string,
  userId: string | number,
  req: TimeEntryRequest
): Promise<unknown> {
  const base = getApiBaseUrl();
  const url = `${base}/system/users/${userId}/timeEntries`; // POST /system/users/{userId}/timeEntries :contentReference[oaicite:4]{index=4}

  return await jsonFetch<unknown>(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(req),
  });
}

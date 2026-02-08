import * as vscode from "vscode";
import * as fs from "fs/promises";
import * as path from "path";

export type UserCredentials = {
  loginName: string;
  password: string;
};

async function fileExists(p: string): Promise<boolean> {
  try {
    await fs.stat(p);
    return true;
  } catch {
    return false;
  }
}

export async function loadUserCredentialsFromWorkspace(): Promise<{
  absolutePath: string;
  data: UserCredentials;
}> {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders || folders.length === 0) {
    throw new Error("No workspace folder is open.");
  }

  const workspaceRoot = folders[0].uri.fsPath;

  // 探索順：foam を開く前提で daily/user.json が本命
  const candidates = [
    path.join("daily", "user.json"),
    "user.json", // daily フォルダを直接開いた場合の保険
  ];

  let found: string | null = null;
  for (const rel of candidates) {
    const abs = path.join(workspaceRoot, rel);
    if (await fileExists(abs)) {
      found = abs;
      break;
    }
  }

  if (!found) {
    throw new Error(
      `user.json not found. Expected at: ${candidates
        .map((p) => path.join(workspaceRoot, p))
        .join(" or ")}`
    );
  }

  const raw = await fs.readFile(found, "utf8");
  const json = JSON.parse(raw) as Partial<UserCredentials>;

  if (!json.loginName || typeof json.loginName !== "string") {
    throw new Error(`Invalid user.json: "loginName" is required (${found})`);
  }
  if (!json.password || typeof json.password !== "string") {
    throw new Error(`Invalid user.json: "password" is required (${found})`);
  }

  return { absolutePath: found, data: { loginName: json.loginName, password: json.password } };
}

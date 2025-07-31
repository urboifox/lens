import fs from "node:fs";
import path from "node:path";
import { LogEntry } from "./types";

const logPath = path.join(process.cwd(), ".lens", "lens.ndjson");
fs.mkdirSync(path.dirname(logPath), { recursive: true });
const stream = fs.createWriteStream(logPath, { flags: "a" });

export function readLogs(): LogEntry[] {
  if (!fs.existsSync(logPath)) return [];
  const raw = fs.readFileSync(logPath, "utf8");
  return raw
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line) as LogEntry;
      } catch {
        return null;
      }
    })
    .filter((entry): entry is LogEntry => Boolean(entry));
}

export function append(entry: LogEntry) {
  stream.write(JSON.stringify(entry) + "\n");
}

export function clear() {
  fs.writeFileSync(logPath, "");
}

export function getEntries<T>(filterFn?: (entry: LogEntry) => boolean): T[] {
  const parsed = readLogs();
  const filtered = filterFn ? parsed.filter(filterFn) : parsed;
  return filtered as T[];
}

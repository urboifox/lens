import fs from "node:fs";
import path from "node:path";
import { LogEntry } from "./types";

const logPath = path.join(process.cwd(), ".lens", "lens.ndjson");
fs.mkdirSync(path.dirname(logPath), { recursive: true });
const stream = fs.createWriteStream(logPath, { flags: "a" });

const buffer: string[] = [];
const FLUSH_INTERVAL = 100;
let flushTimeout: NodeJS.Timeout | null = null;

function flush() {
  if (buffer.length) {
    stream.write(buffer.join(""));
    buffer.length = 0;
  }
  flushTimeout = null;
}

export function append(entry: LogEntry) {
  buffer.push(JSON.stringify(entry) + "\n");

  if (!flushTimeout) {
    flushTimeout = setTimeout(flush, FLUSH_INTERVAL);
  }
}

export function clear() {
  fs.writeFileSync(logPath, "");
}

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

export function getEntries<T>(filterFn?: (entry: LogEntry) => boolean): T[] {
  const parsed = readLogs();
  const filtered = filterFn ? parsed.filter(filterFn) : parsed;
  return filtered as T[];
}

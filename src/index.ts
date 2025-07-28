import db, { client } from "./db";
import { entries } from "./db/schema";
import { pushSQLiteSchema } from "drizzle-kit/api";
import * as schema from "./db/schema";
import { AsyncLocalStorage } from "node:async_hooks";
import { and, eq } from "drizzle-orm";

const LENS_STORAGE_SYMBOL = Symbol.for("lens.storage");

const globalWithLens = global as typeof global & {
  [LENS_STORAGE_SYMBOL]: AsyncLocalStorage<{ requestId?: string }>;
};

if (!globalWithLens[LENS_STORAGE_SYMBOL]) {
  globalWithLens[LENS_STORAGE_SYMBOL] = new AsyncLocalStorage();
}

export const lensStorage = globalWithLens[LENS_STORAGE_SYMBOL];

function getRequestId() {
  return lensStorage.getStore()?.requestId;
}

export async function addEntry(entry: {
  content: Object;
  type: string;
  requestId?: string;
}) {
  await db.insert(entries).values(entry);
}

export async function getEntries() {
  return await db.select().from(entries);
}

export async function clearEntries() {
  await db.delete(entries);
}

export async function logQuery(query: string) {
  const requestId = getRequestId();
  await addEntry({
    content: { query },
    requestId,
    type: "query",
  });
}

export async function getRequestQueries(requestId: string) {
  return await db
    .select()
    .from(entries)
    .where(and(eq(entries.requestId, requestId), eq(entries.type, "query")));
}

export async function getQueries() {
  return await db.select().from(entries).where(eq(entries.type, "query"));
}

export async function init() {
  const { statementsToExecute } = await pushSQLiteSchema(schema, db);
  statementsToExecute.forEach((statement) => client.execute(statement));
}

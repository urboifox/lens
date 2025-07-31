import { AsyncLocalStorage } from "node:async_hooks";

const store = new AsyncLocalStorage<{ requestId?: string }>();

export function runWithRequestId<T>(requestId: string, fn: () => T) {
  return store.run({ requestId }, fn);
}

export function getRequestId(): string | undefined {
  return store.getStore()?.requestId;
}

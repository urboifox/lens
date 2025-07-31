import { getRequestId } from "./context";
import { append, getEntries } from "./store";
import { LogQuery, LogQueryInput, LogRequest, LogRequestInput } from "./types";

export { clear } from "./store";

export function logRequest(data: LogRequestInput) {
  const entry: LogRequest = {
    ...data,
    type: "request",
    timestamp: Date.now(),
  };

  append(entry);
}

export function logQuery(data: LogQueryInput) {
  const requestId = getRequestId();

  const entry: LogQuery = {
    ...data,
    type: "query",
    timestamp: Date.now(),
    requestId,
  };

  append(entry);
}

export function getRequests() {
  const requests = getEntries<LogRequest>((entry) => entry.type === "request");
  return requests;
}

export function getQueries() {
  return getEntries<LogQuery>((entry) => entry.type === "query");
}

export function getRequestById(id: string): LogRequest | undefined {
  return getEntries<LogRequest>(
    (e) => e.type === "request" && e.requestId === id,
  )[0];
}

export function getRequestQueries(requestId: string): LogQuery[] {
  return getEntries<LogQuery>(
    (entry) => entry.type === "query" && entry.requestId === requestId,
  );
}

export function getRecentRequests(limit = 50): LogRequest[] {
  return getRequests().slice(-limit).reverse();
}

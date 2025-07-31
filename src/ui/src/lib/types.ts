export type LensConfig = {
    path: string;
};

type EntryHeaders = Record<string, number | string | string[] | undefined>;

export type LogRequest = {
    type: 'request';
    requestId: string;
    timestamp: number;
    method: string;
    path: string;
    status: number;
    durationMs: number;
    ip: string;
    memoryUsageMb: number;
    request: {
        headers: EntryHeaders;
        body?: string;
    };
    response: {
        headers: EntryHeaders;
        body?: string;
    };
};

export type LogQuery = {
    type: 'query';
    timestamp: number;
    query: string;
    durationMs: number;
    requestId?: string;
};

export type LogEntry = LogRequest | LogQuery;

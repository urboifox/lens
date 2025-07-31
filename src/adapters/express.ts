import express from 'express';
import { NextFunction, Request, Response } from 'express';
import path from 'node:path';
import { logRequest } from '../logger';
import { LensOptions } from '../types';
import { runWithRequestId } from '../logger/context';

export { getRequestId } from '../logger/context';
export { createProxy } from '../logger/proxy';

async function middleware(req: Request, res: Response, next: NextFunction) {
    const requestId = crypto.randomUUID();
    runWithRequestId(requestId, () => {
        const memoryUsageMb = process.memoryUsage().rss / 1024 / 1024;
        const start = process.hrtime();

        res.on('finish', async () => {
            const end = process.hrtime(start);
            logRequest({
                method: req.method,
                status: res.statusCode,
                path: req.path,
                requestId,
                ip: req.ip ?? '-',
                memoryUsageMb,
                durationMs: end[0] * 1000 + end[1] / 1000000,
                request: {
                    headers: req.headers,
                    body: req.body
                },
                response: {
                    headers: res.getHeaders()
                    // TODO: get response body
                }
            });
        });

        next();
    });
}

function routes(): express.Router {
    const router = express.Router();

    const uiPath = path.resolve(__dirname, '..', 'ui');
    router.use(express.static(uiPath));

    router.use('/{*splat}', (_, res) => {
        res.sendFile(path.join(uiPath, 'index.html'));
    });

    return router;
}

export function lens(options: LensOptions = {}): express.Router {
    const path = options.path || '/lens';

    const router = express.Router();
    router.use(middleware);

    router.get('/lens-config', (_, res) => {
        res.json({ path });
    });

    router.use(path, routes());
    return router;
}

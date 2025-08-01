import express from 'express';
import { NextFunction, Request, Response } from 'express';
import path from 'node:path';
import {
    getQueryByRequestId,
    getRecentQueries,
    getRecentRequests,
    getRequestById,
    logRequest
} from '../logger';
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

    router.get('/api/requests', (_, res) => {
        res.json(getRecentRequests());
    });

    router.get('/api/requests/:id', (req, res) => {
        const { id } = req.params;
        res.json(getRequestById(id));
    });

    router.get('/api/queries', (_, res) => {
        res.json(getRecentQueries());
    });

    router.get('/api/queries/:id', (req, res) => {
        const { id } = req.params;
        res.json(getQueryByRequestId(id));
    });

    router.use('/', (_, res) => {
        res.sendFile(path.join(uiPath, 'index.html'));
    });

    return router;
}

export function lens(options: LensOptions = {}): express.Router {
    const path = options.path || '/lens';

    const router = express.Router();

    router.get('/lens-config', (_, res) => {
        res.json({ path });
    });

    router.use((req, res, next) => {
        if (req.path !== path + '/' && req.path.length > path.length && req.path.endsWith('/')) {
            const query = req.url.slice(req.path.length);
            res.redirect(301, req.path.slice(0, -1) + query);
        } else {
            next();
        }
    });

    router.use((req, _, next) => {
        if (req.path.includes('/_app/')) {
            const appPathIndex = req.path.indexOf('/_app/');
            if (appPathIndex > 5) {
                req.url = path + req.path.substring(appPathIndex);
            }
        }
        next();
    });

    router.use(path, routes());
    router.use(middleware);

    return router;
}

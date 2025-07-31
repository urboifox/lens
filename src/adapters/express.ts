import express from "express";
import { NextFunction, Request, Response, Router } from "express";
import path from "node:path";
import { clear, getRequestQueries, logQuery, logRequest } from "../logger";
import { LensOptions } from "../types";
import { runWithRequestId } from "../logger/context";

export { getRequestId } from "../logger/context";
export { createProxy } from "../logger/proxy";

async function middleware(req: Request, res: Response, next: NextFunction) {
  const requestId = crypto.randomUUID();

  runWithRequestId(requestId, () => {
    const memoryUsageMb = process.memoryUsage().rss / 1024 / 1024;
    const start = process.hrtime();

    res.on("finish", async () => {
      const end = process.hrtime(start);
      logRequest({
        method: req.method,
        status: res.statusCode,
        path: req.path,
        requestId,
        ip: req.ip ?? "-",
        memoryUsageMb,
        durationMs: end[0] * 1000 + end[1] / 1000000,
        request: {
          headers: req.headers,
          body: req.body,
        },
        response: {
          headers: res.getHeaders(),
          // TODO: get response body
        },
      });
    });

    next();
  });
}

function routes(): Router {
  const router = Router();

  const uiPath = path.resolve(__dirname, "..", "ui");
  router.use(express.static(uiPath));

  router.get("/", (_, res) => {
    res.sendFile(path.join(uiPath, "index.html"));
  });

  router.get("/clear", async (_, res) => {
    clear();
    res.json({ success: true });
  });

  router.get("/log", async (_, res) => {
    logQuery({
      query: "SELECT * FROM entries",
      durationMs: 100,
    });
    res.json({ success: true });
  });

  router.get("/requests/:id/queries", async (req, res) => {
    const id = req.params.id;
    const queries = getRequestQueries(id);
    res.json(queries);
  });

  return router;
}

export function lens(options: LensOptions = {}): Router {
  const router = Router();
  router.use(middleware);
  router.use(options.path || "/lens", routes());
  return router;
}

import express from "express";
import { NextFunction, Request, Response, Router } from "express";
import {
  addEntry,
  clearEntries,
  getRequestQueries,
  init,
  lensStorage,
  logQuery,
} from "../core";
import path from "node:path";

let initialized = false;

async function middleware(req: Request, res: Response, next: NextFunction) {
  if (!initialized) {
    await init();
    initialized = true;
  }

  const requestId = crypto.randomUUID();

  lensStorage.run({ requestId }, () => {
    res.on("finish", async () => {
      await addEntry({
        content: {
          method: req.method,
          url: req.originalUrl,
          status: res.statusCode,
          headers: req.headers,
          body: req.body,
          params: req.params,
        },
        requestId,
        type: "request",
      });
    });

    next();
  });
}

function routes(): Router {
  const router = Router();

  const uiPath = path.resolve(__dirname, "ui");

  router.use(express.static(uiPath));

  router.get("/", (_, res) => {
    res.sendFile(path.join(uiPath, "index.html"));
  });

  router.get("/clear", async (_, res) => {
    await clearEntries();
    res.json({ success: true });
  });

  router.get("/log", async (_, res) => {
    await logQuery("SELECT * FROM entries");
    res.json({ success: true });
  });

  router.get("/requests/:id/queries", async (req, res) => {
    const id = req.params.id;

    const queries = await getRequestQueries(id);
    res.json(queries);
  });

  return router;
}

export type LensHandlerOptions = {
  path?: string;
};

export function lens(options: LensHandlerOptions = {}): Router {
  const router = Router();
  router.use(middleware);
  router.use(options.path || "/lens", routes());
  return router;
}

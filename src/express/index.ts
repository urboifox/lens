import { NextFunction, Request, Response, Router } from "express";
import {
  addEntry,
  clearEntries,
  getEntries,
  getRequestQueries,
  init,
  lensStorage,
  logQuery,
} from "..";

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

export function routes(): Router {
  const router = Router();

  router.get("/", async (_, res) => {
    const requests = await getEntries();
    res.json({ requests });
    // TODO: Server the ui here
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

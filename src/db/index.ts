import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import { createClient } from "@libsql/client";
import fs from "fs";
import path from "path";

const db_path = path.resolve(process.cwd(), ".lens", "lens.db");

fs.mkdirSync(path.dirname(db_path), { recursive: true });

export const client = createClient({ url: `file:${db_path}` });
const db = drizzle(client, { schema });

export default db;

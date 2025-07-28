import { defineConfig } from "tsup";

export default defineConfig({
  format: [ "esm"],
  entry: ["src/index.ts", "src/express/index.ts"],
  dts: true,
  shims: true,
  skipNodeModulesBundle: true,
  clean: true,
  external: ["./src/ui/build/handler.js"],
});

import { defineConfig } from 'tsup';

export default defineConfig({
    format: ['esm', 'cjs'],
    entry: ['src/index.ts', 'src/adapters/express.ts'],
    outDir: 'dist',
    dts: true,
    shims: true,
    skipNodeModulesBundle: true,
    clean: true
});

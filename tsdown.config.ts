import { defineConfig } from 'tsdown'

export default defineConfig({
    outDir: 'dist',
    format: ['esm', 'cjs'],
    entry: [
        './src/index.ts', 
        './src/withs/index.ts', 
        './src/withs/postgres/index.ts', 
        './src/withs/mysql/index.ts'
    ],
    external: ['drizzle-orm', 'prettier'],
    dts: true,
    treeshake: true
})

//// [library-reference-6.ts]
// The primary lookup folder is relative to tsconfig.json, if present
//// [/node_modules/@types/alpha/index.d.ts]
//// [/src/foo.ts]
/// <reference types="alpha" />
alpha.a;
//// [/tsconfig.json]

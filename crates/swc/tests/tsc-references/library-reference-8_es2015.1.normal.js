// @noImplicitReferences: true
// @traceResolution: true
// @typeRoots: /test/types
// @currentDirectory: /test
// Don't crash in circular library reference situations
// @filename: /test/types/alpha/index.d.ts
/// <reference types="beta" />
// @filename: /test/types/beta/index.d.ts
/// <reference types="alpha" />
// @filename: /test/foo.ts
/// <reference types="alpha" />
/// <reference types="beta" />
var x = alpha.a + beta.b;

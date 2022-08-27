//// [library-reference-8.ts]
// Don't crash in circular library reference situations
//// [/test/types/alpha/index.d.ts]
/// <reference types="beta" />
//// [/test/types/beta/index.d.ts]
/// <reference types="alpha" />
//// [/test/foo.ts]
/// <reference types="alpha" />
/// <reference types="beta" />
var x = alpha.a + beta.b;

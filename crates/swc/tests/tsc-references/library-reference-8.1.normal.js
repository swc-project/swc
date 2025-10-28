//// [library-reference-8.ts]
//// [/test/types/alpha/index.d.ts]
//// [/test/types/beta/index.d.ts]
//// [/test/foo.ts]
/// <reference types="alpha" />
/// <reference types="beta" />
var x = alpha.a + beta.b;

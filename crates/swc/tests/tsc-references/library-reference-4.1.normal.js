//// [library-reference-4.ts]
// Secondary references may be duplicated if they agree in content
//// [/node_modules/foo/index.d.ts]
/// <reference types="alpha" />
//// [/node_modules/foo/node_modules/alpha/index.d.ts]
//// [/node_modules/bar/index.d.ts]
/// <reference types="alpha" />
//// [/node_modules/bar/node_modules/alpha/index.d.ts]
//// [/src/root.ts]
/// <reference types="foo" />
/// <reference types="bar" />

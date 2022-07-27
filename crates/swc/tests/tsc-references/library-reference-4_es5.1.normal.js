// @noImplicitReferences: true
// @traceResolution: true
// @typeRoots: /src
// @currentDirectory: test
// Secondary references may be duplicated if they agree in content
// @filename: /node_modules/foo/index.d.ts
/// <reference types="alpha" />
// @filename: /node_modules/foo/node_modules/alpha/index.d.ts
// @filename: /node_modules/bar/index.d.ts
/// <reference types="alpha" />
// @filename: /node_modules/bar/node_modules/alpha/index.d.ts
// @filename: /src/root.ts
/// <reference types="foo" />
/// <reference types="bar" />

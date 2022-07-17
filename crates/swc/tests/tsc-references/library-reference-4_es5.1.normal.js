// @noImplicitReferences: true
// @traceResolution: true
// @typeRoots: /src
// @currentDirectory: test
// Secondary references may be duplicated if they agree in content
// @filename: /node_modules/foo/index.d.ts
/// <reference types="alpha" />
 // @filename: /src/root.ts
 /// <reference types="foo" />
 /// <reference types="bar" />

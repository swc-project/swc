// @noImplicitReferences: true
// @traceResolution: true
// @currentDirectory: /
// @typeRoots: types
// Secondary references may not be duplicated if they disagree in content
// @filename: /node_modules/foo/index.d.ts
/// <reference types="alpha" />
 // @filename: /src/root.ts
 /// <reference types="foo" />
 /// <reference types="bar" />

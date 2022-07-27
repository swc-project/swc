// @noImplicitReferences: true
// @traceResolution: true
// @types: jquery
// @currentDirectory: /a
// @typeRoots: types
// @filename: /a/types/jquery/index.d.ts
// @filename: /a/types/jquery2/index.d.ts
// @filename: /a/b/consumer.ts
$.foo(); // should OK
$2.foo(); // should error

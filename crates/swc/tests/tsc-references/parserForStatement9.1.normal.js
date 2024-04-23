//// [parserForStatement9.ts]
// repro from https://github.com/microsoft/TypeScript/issues/54769
for(var _ref = [], tmp = _ref[0], x = tmp === void 0 ? ('a' in {}) : tmp; !x; x = !x)console.log(x);
for(var _ref1 = {}, _ref_x = _ref1.x, x1 = _ref_x === void 0 ? ('a' in {}) : _ref_x; !x1; x1 = !x1)console.log(x1);

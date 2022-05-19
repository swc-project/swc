var ref;
// @target: esnext,es2015,es5
// @noTypesAndSymbols: true
// https://github.com/microsoft/TypeScript/issues/36295
const a = ()=>undefined;
(({ [(ref = a()) === null || ref === void 0 ? void 0 : ref.d]: c = ""  })=>{})();

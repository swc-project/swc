var ref, ref1;
// @target: esnext,es2015,es5
// @noTypesAndSymbols: true
// @noEmit: true
// https://github.com/microsoft/TypeScript/issues/36295
const a = ()=>undefined;
((b = (ref = a()) === null || ref === void 0 ? void 0 : ref.d)=>{
    var a;
})();
const x = "";
((b = (ref1 = a()) === null || ref1 === void 0 ? void 0 : ref1.d, d = x)=>{
    var x;
})();

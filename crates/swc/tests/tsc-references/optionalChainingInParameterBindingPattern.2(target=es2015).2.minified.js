//// [optionalChainingInParameterBindingPattern.2.ts]
var _a, _a1;
let a = ()=>void 0;
(({ [null == (_a = a()) ? void 0 : _a.d]: c = "" })=>{})();
let x = "";
(({ [null == (_a1 = a()) ? void 0 : _a1.d]: c }, d = x)=>{})();

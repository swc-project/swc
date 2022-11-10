//// [optionalChainingInParameterBindingPattern.2.ts]
// https://github.com/microsoft/TypeScript/issues/36295
var _a, _a1;
const a = ()=>undefined;
(({ [(_a = a()) === null || _a === void 0 ? void 0 : _a.d]: c = ""  })=>{
    var a1;
})();
const x = "";
(({ [(_a1 = a()) === null || _a1 === void 0 ? void 0 : _a1.d]: c  }, d = x)=>{
    var x1;
})();

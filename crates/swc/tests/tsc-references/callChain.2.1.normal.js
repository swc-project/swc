//// [callChain.2.ts]
var _o1, _o2, _o3_b, _o3;
(_o1 = o1) === null || _o1 === void 0 ? void 0 : _o1();
(_o2 = o2) === null || _o2 === void 0 ? void 0 : _o2.b();
(_o3_b = (_o3 = o3).b) === null || _o3_b === void 0 ? void 0 : _o3_b.call(_o3).c;

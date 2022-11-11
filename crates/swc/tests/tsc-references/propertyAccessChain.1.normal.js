//// [propertyAccessChain.ts]
var _o3_b, _o4_b, _ref, _o5_b, _ref1, _o6;
o1 === null || o1 === void 0 ? void 0 : o1.b;
o2 === null || o2 === void 0 ? void 0 : o2.b.c;
(_o3_b = o3.b) === null || _o3_b === void 0 ? void 0 : _o3_b.c;
(_ref = (_o4_b = o4.b) === null || _o4_b === void 0 ? void 0 : _o4_b.c.d) === null || _ref === void 0 ? void 0 : _ref.e;
(_ref1 = (_o5_b = o5.b) === null || _o5_b === void 0 ? void 0 : _o5_b.call(o5).c.d) === null || _ref1 === void 0 ? void 0 : _ref1.e;
(_o6 = o6()) === null || _o6 === void 0 ? void 0 : _o6.x;
// GH#34109
(o1 === null || o1 === void 0 ? void 0 : o1.b) ? 1 : 0;
// GH#36031
o2 === null || o2 === void 0 ? void 0 : o2.b.c;
o2 === null || o2 === void 0 ? void 0 : o2.b.c;

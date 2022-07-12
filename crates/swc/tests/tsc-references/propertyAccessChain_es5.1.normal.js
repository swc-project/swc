// @strict: true
var ref, ref1, ref2, ref3, ref4, ref5;
o1 === null || o1 === void 0 ? void 0 : o1.b;
o2 === null || o2 === void 0 ? void 0 : o2.b.c;
(ref = o3.b) === null || ref === void 0 ? void 0 : ref.c;
(ref2 = (ref1 = o4.b) === null || ref1 === void 0 ? void 0 : ref1.c.d) === null || ref2 === void 0 ? void 0 : ref2.e;
(ref4 = (ref3 = o5.b) === null || ref3 === void 0 ? void 0 : ref3.call(o5).c.d) === null || ref4 === void 0 ? void 0 : ref4.e;
(ref5 = o6()) === null || ref5 === void 0 ? void 0 : ref5.x;
// GH#34109
(o1 === null || o1 === void 0 ? void 0 : o1.b) ? 1 : 0;
// GH#36031
o2 === null || o2 === void 0 ? void 0 : o2.b.c;
o2 === null || o2 === void 0 ? void 0 : o2.b.c;

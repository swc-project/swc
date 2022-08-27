//// [callChain.ts]
var _o2, _o21, _o22, _o23, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
var ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, ref10, ref11, ref12;
o1 === null || o1 === void 0 ? void 0 : o1();
o1 === null || o1 === void 0 ? void 0 : o1(1);
o1 === null || o1 === void 0 ? void 0 : o1.apply(void 0, [
    1,
    2
]);
o1 === null || o1 === void 0 ? void 0 : o1.apply(void 0, [
    1,
    2,
    3,
    4
]);
o2 === null || o2 === void 0 ? void 0 : o2.b();
o2 === null || o2 === void 0 ? void 0 : o2.b(1);
o2 === null || o2 === void 0 ? void 0 : (_o2 = o2).b.apply(_o2, [
    1,
    2
]);
o2 === null || o2 === void 0 ? void 0 : (_o21 = o2).b.apply(_o21, [
    1,
    2,
    3,
    4
]);
o2 === null || o2 === void 0 ? void 0 : o2["b"]();
o2 === null || o2 === void 0 ? void 0 : o2["b"](1);
o2 === null || o2 === void 0 ? void 0 : (_o22 = o2)["b"].apply(_o22, [
    1,
    2
]);
o2 === null || o2 === void 0 ? void 0 : (_o23 = o2)["b"].apply(_o23, [
    1,
    2,
    3,
    4
]);
(ref = o3.b) === null || ref === void 0 ? void 0 : ref.call(o3).c;
(ref1 = o3.b) === null || ref1 === void 0 ? void 0 : ref1.call(o3, 1).c;
(ref2 = o3.b) === null || ref2 === void 0 ? void 0 : (_ref = ref2).call.apply(_ref, [
    o3,
    1,
    2
]).c;
(ref3 = o3.b) === null || ref3 === void 0 ? void 0 : (_ref1 = ref3).call.apply(_ref1, [
    o3,
    1,
    2,
    3,
    4
]).c;
(ref4 = o3.b) === null || ref4 === void 0 ? void 0 : ref4.call(o3)["c"];
(ref5 = o3.b) === null || ref5 === void 0 ? void 0 : ref5.call(o3, 1)["c"];
(ref6 = o3.b) === null || ref6 === void 0 ? void 0 : (_ref2 = ref6).call.apply(_ref2, [
    o3,
    1,
    2
])["c"];
(ref7 = o3.b) === null || ref7 === void 0 ? void 0 : (_ref3 = ref7).call.apply(_ref3, [
    o3,
    1,
    2,
    3,
    4
])["c"];
(ref8 = o3["b"]) === null || ref8 === void 0 ? void 0 : ref8.call(o3).c;
(ref9 = o3["b"]) === null || ref9 === void 0 ? void 0 : ref9.call(o3, 1).c;
(ref10 = o3["b"]) === null || ref10 === void 0 ? void 0 : (_ref4 = ref10).call.apply(_ref4, [
    o3,
    1,
    2
]).c;
(ref11 = o3["b"]) === null || ref11 === void 0 ? void 0 : (_ref5 = ref11).call.apply(_ref5, [
    o3,
    1,
    2,
    3,
    4
]).c;
var v = o4 === null || o4 === void 0 ? void 0 : o4(incr);
(ref12 = o5()) === null || ref12 === void 0 ? void 0 : ref12();
// GH#36031
o2 === null || o2 === void 0 ? void 0 : o2.b().toString;
o2 === null || o2 === void 0 ? void 0 : o2.b().toString;

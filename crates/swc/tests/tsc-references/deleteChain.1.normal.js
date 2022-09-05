//// [deleteChain.ts]
var ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, ref10, ref11, ref12, ref13, ref14, ref15;
o1 === null || o1 === void 0 ? void 0 : delete o1.b;
delete (o1 === null || o1 === void 0 ? void 0 : o1.b);
o2 === null || o2 === void 0 ? void 0 : delete o2.b.c;
delete (o2 === null || o2 === void 0 ? void 0 : o2.b.c);
(ref = o3.b) === null || ref === void 0 ? void 0 : delete ref.c;
delete ((ref1 = o3.b) === null || ref1 === void 0 ? void 0 : ref1.c);
(ref3 = (ref2 = o4.b) === null || ref2 === void 0 ? void 0 : ref2.c.d) === null || ref3 === void 0 ? void 0 : delete ref3.e;
(ref5 = (ref4 = o4.b) === null || ref4 === void 0 ? void 0 : ref4.c.d) === null || ref5 === void 0 ? void 0 : delete ref5.e;
delete ((ref7 = (ref6 = o4.b) === null || ref6 === void 0 ? void 0 : ref6.c.d) === null || ref7 === void 0 ? void 0 : ref7.e);
(ref9 = (ref8 = o5.b) === null || ref8 === void 0 ? void 0 : ref8.call(o5).c.d) === null || ref9 === void 0 ? void 0 : delete ref9.e;
delete ((ref11 = (ref10 = o5.b) === null || ref10 === void 0 ? void 0 : ref10.call(o5).c.d) === null || ref11 === void 0 ? void 0 : ref11.e);
(ref13 = (ref12 = o6.b) === null || ref12 === void 0 ? void 0 : ref12["c"].d) === null || ref13 === void 0 ? void 0 : delete ref13["e"];
delete ((ref15 = (ref14 = o6.b) === null || ref14 === void 0 ? void 0 : ref14["c"].d) === null || ref15 === void 0 ? void 0 : ref15["e"]);

var ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, ref10, ref11, ref12, ref13, ref14, ref15, ref16, ref17, ref18, ref19;
let a;
null == o || o[a = 1], a.toString();
let b;
null == o || o.x[b = 1], b.toString();
let c;
null == o || o(c = 1), c.toString();
let d;
null == o || o.x(d = 1), d.toString(), null == f || f(x), f(x), f(x), (null == o2 ? void 0 : o2.f(x)) ? (o2.f, null == o2 || o2.f, null == o2 || o2.f(x)) : (null == o2 || o2.f, o2.f), null == o2 || o2.f, o2.f, (null == o3 ? void 0 : o3.x) === 1 ? (o3.x, null == o3 || o3.x) : (null == o3 || o3.x, o3.x), null == o3 || o3.x, o3.x, (null === (ref = o4.x) || void 0 === ref ? void 0 : ref.y) ? (o4.x, o4.x.y, null === (ref9 = o4.x) || void 0 === ref9 || ref9.y) : (o4.x, null === (ref10 = o4.x) || void 0 === ref10 || ref10.y, o4.x.y), o4.x, null === (ref1 = o4.x) || void 0 === ref1 || ref1.y, o4.x.y, (null === (ref3 = null === (ref2 = o5.x) || void 0 === ref2 ? void 0 : ref2.y.z) || void 0 === ref3 ? void 0 : ref3.w) ? (o5.x, o5.x.y, o5.x.y.z, o5.x.y.z.w, null === (ref11 = o5.x.y.z) || void 0 === ref11 || ref11.w, null === (ref12 = o5.x) || void 0 === ref12 || ref12.y.z.w, null === (ref14 = null === (ref13 = o5.x) || void 0 === ref13 ? void 0 : ref13.y.z) || void 0 === ref14 || ref14.w) : (o5.x, null === (ref15 = o5.x) || void 0 === ref15 || ref15.y, null === (ref16 = o5.x) || void 0 === ref16 || ref16.y.z, null === (ref18 = null === (ref17 = o5.x) || void 0 === ref17 ? void 0 : ref17.y.z) || void 0 === ref18 || ref18.w, o5.x.y, o5.x.y.z.w), o5.x, null === (ref4 = o5.x) || void 0 === ref4 || ref4.y, null === (ref5 = o5.x) || void 0 === ref5 || ref5.y.z, null === (ref7 = null === (ref6 = o5.x) || void 0 === ref6 ? void 0 : ref6.y.z) || void 0 === ref7 || ref7.w, o5.x.y, o5.x.y.z.w, (null == o6 ? void 0 : o6.f()) || null == o6 || o6.f, o6.f, null == o6 || o6.f, o6.f;
let lastSomeProperty;
function someFunction(someOptionalObject) {
    (null == someOptionalObject ? void 0 : someOptionalObject.someProperty) !== lastSomeProperty && (console.log(someOptionalObject), console.log(someOptionalObject.someProperty), lastSomeProperty = null == someOptionalObject ? void 0 : someOptionalObject.someProperty);
}
someFunction({
    someProperty: 42
}), someFunction(void 0);
let i = 0;
for(; (null === (ref8 = arr[i]) || void 0 === ref8 ? void 0 : ref8.tag) === "left";)i += 1, (null === (ref19 = arr[i]) || void 0 === ref19 ? void 0 : ref19.tag) === "right" && console.log("I should ALSO be reachable");

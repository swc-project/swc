//// [controlFlowOptionalChain.ts]
import _instanceof from "@swc/helpers/src/_instanceof.mjs";
import _type_of from "@swc/helpers/src/_type_of.mjs";
function f01(x1) {
    null == isString || isString(x1), null == maybeIsString || maybeIsString(x1), isDefined(maybeIsString), null == maybeIsString || maybeIsString(x1), null == maybeNever || maybeNever();
}
function f10(o1, value) {
    (null == o1 ? void 0 : o1.foo) === value && o1.foo, (null == o1 ? void 0 : o1.foo) === value && o1.foo, (null == o1 ? void 0 : o1.bar()) === value && o1.bar, (null == o1 ? void 0 : o1.foo) == value && o1.foo, (null == o1 ? void 0 : o1.foo) == value && o1.foo, (null == o1 ? void 0 : o1.bar()) == value && o1.bar;
}
function f11(o1, value) {
    (null == o1 ? void 0 : o1.foo) === value && o1.foo, (null == o1 ? void 0 : o1.foo) === value && o1.foo, (null == o1 ? void 0 : o1.bar()) === value && o1.bar, (null == o1 ? void 0 : o1.foo) == value && o1.foo, (null == o1 ? void 0 : o1.foo) == value && o1.foo, (null == o1 ? void 0 : o1.bar()) == value && o1.bar;
}
function f12(o1, value) {
    (null == o1 ? void 0 : o1.foo) === value && o1.foo, (null == o1 ? void 0 : o1.foo) === value && o1.foo, (null == o1 ? void 0 : o1.bar()) === value && o1.bar, (null == o1 ? void 0 : o1.foo) == value && o1.foo, (null == o1 ? void 0 : o1.foo) == value && o1.foo, (null == o1 ? void 0 : o1.bar()) == value && o1.bar;
}
function f12a(o1, value) {
    (null == o1 ? void 0 : o1.foo) === value && o1.foo, (null == o1 ? void 0 : o1.foo) === value && o1.foo, (null == o1 ? void 0 : o1.bar()) === value && o1.bar, (null == o1 ? void 0 : o1.foo) == value && o1.foo, (null == o1 ? void 0 : o1.foo) == value && o1.foo, (null == o1 ? void 0 : o1.bar()) == value && o1.bar;
}
function f13(o1) {
    (null == o1 ? void 0 : o1.foo) !== void 0 && o1.foo, (null == o1 ? void 0 : o1.foo) !== void 0 && o1.foo, (null == o1 ? void 0 : o1.bar()) !== void 0 && o1.bar, (null == o1 ? void 0 : o1.foo) != void 0 && o1.foo, (null == o1 ? void 0 : o1.foo) != void 0 && o1.foo, (null == o1 ? void 0 : o1.bar()) != void 0 && o1.bar;
}
function f13a(o1) {
    (null == o1 ? void 0 : o1.foo) !== null && o1.foo, (null == o1 ? void 0 : o1.foo) !== null && o1.foo, (null == o1 ? void 0 : o1.bar()) !== null && o1.bar, (null == o1 ? void 0 : o1.foo) != null && o1.foo, (null == o1 ? void 0 : o1.foo) != null && o1.foo, (null == o1 ? void 0 : o1.bar()) != null && o1.bar;
}
function f14(o1) {
    (null == o1 ? void 0 : o1.foo) !== void 0 && o1.foo, (null == o1 ? void 0 : o1.foo) !== void 0 && o1.foo, (null == o1 ? void 0 : o1.bar()) !== void 0 && o1.bar;
}
function f15(o1, value) {
    null == o1 || o1.foo, o1.foo, null == o1 || o1.foo, o1.foo, null == o1 || o1.foo, o1.foo, null == o1 || o1.foo, o1.foo;
}
function f15a(o1, value) {
    null == o1 || o1.foo, o1.foo, null == o1 || o1.foo, o1.foo, null == o1 || o1.foo, o1.foo, null == o1 || o1.foo, o1.foo;
}
function f16(o1) {
    null == o1 || o1.foo, o1.foo, null == o1 || o1.foo, o1.foo, null == o1 || o1.foo, o1.foo, null == o1 || o1.foo, o1.foo;
}
function f20(o1) {
    "number" == typeof (null == o1 ? void 0 : o1.foo) && o1.foo, "number" == typeof (null == o1 ? void 0 : o1.foo) && o1.foo, "number" == typeof (null == o1 ? void 0 : o1.bar()) && o1.bar, _instanceof(null == o1 ? void 0 : o1.baz, Error) && o1.baz;
}
function f21(o1) {
    "number" == typeof (null == o1 ? void 0 : o1.foo) && o1.foo, "number" == typeof (null == o1 ? void 0 : o1.foo) && o1.foo, "number" == typeof (null == o1 ? void 0 : o1.bar()) && o1.bar, _instanceof(null == o1 ? void 0 : o1.baz, Error) && o1.baz;
}
function f22(o1) {
    null == o1 || o1.foo, o1.foo, null == o1 || o1.foo, o1.foo, null == o1 || o1.foo, o1.foo, null == o1 || o1.foo, o1.foo;
}
function f23(o1) {
    null == o1 || o1.foo, o1.foo, null == o1 || o1.foo, o1.foo, null == o1 || o1.foo, o1.foo, null == o1 || o1.foo, o1.foo;
}
function f30(o1) {
    assert(null == o1 ? void 0 : o1.foo), o1.foo, assert((null == o1 ? void 0 : o1.foo) === 42), o1.foo, assert("number" == typeof (null == o1 ? void 0 : o1.foo)), o1.foo, assertNonNull(null == o1 ? void 0 : o1.foo), o1.foo;
}
function f40(o1) {
    null == o1 || o1.foo, o1.foo;
}
function f41(o1) {
    _type_of(null == o1 ? void 0 : o1.foo), o1.foo;
}
function getArea(shape) {
    switch(null == shape ? void 0 : shape.type){
        case "circle":
            return Math.PI * Math.pow(shape.radius, 2);
        case "rectangle":
            return shape.width * shape.height;
        default:
            return 0;
    }
}
function extractCoordinates(f1) {
    var ref;
    return (null === (ref = f1.geometry) || void 0 === ref ? void 0 : ref.type) !== "test" ? [] : f1.geometry.coordinates;
}
function someFunction(someOptionalObject) {
    (null == someOptionalObject ? void 0 : someOptionalObject.someProperty) !== lastSomeProperty && (console.log(someOptionalObject), console.log(someOptionalObject.someProperty), lastSomeProperty = null == someOptionalObject ? void 0 : someOptionalObject.someProperty);
}
null == o || o[a = 1], a.toString(), null == o || o.x[b = 1], b.toString(), null == o || o(c = 1), c.toString(), null == o || o.x(d = 1), d.toString(), null == f || f(x), f(x), f(x), (null == o2 ? void 0 : o2.f(x)) ? (o2.f, null == o2 || o2.f, null == o2 || o2.f(x)) : (null == o2 || o2.f, o2.f), null == o2 || o2.f, o2.f, (null == o3 ? void 0 : o3.x) === 1 ? (o3.x, null == o3 || o3.x) : (null == o3 || o3.x, o3.x), null == o3 || o3.x, o3.x, (null === (ref = o4.x) || void 0 === ref ? void 0 : ref.y) ? (o4.x, o4.x.y, null === (ref9 = o4.x) || void 0 === ref9 || ref9.y) : (o4.x, null === (ref10 = o4.x) || void 0 === ref10 || ref10.y, o4.x.y), o4.x, null === (ref1 = o4.x) || void 0 === ref1 || ref1.y, o4.x.y, (null === (ref3 = null === (ref2 = o5.x) || void 0 === ref2 ? void 0 : ref2.y.z) || void 0 === ref3 ? void 0 : ref3.w) ? (o5.x, o5.x.y, o5.x.y.z, o5.x.y.z.w, null === (ref11 = o5.x.y.z) || void 0 === ref11 || ref11.w, null === (ref12 = o5.x) || void 0 === ref12 || ref12.y.z.w, null === (ref14 = null === (ref13 = o5.x) || void 0 === ref13 ? void 0 : ref13.y.z) || void 0 === ref14 || ref14.w) : (o5.x, null === (ref15 = o5.x) || void 0 === ref15 || ref15.y, null === (ref16 = o5.x) || void 0 === ref16 || ref16.y.z, null === (ref18 = null === (ref17 = o5.x) || void 0 === ref17 ? void 0 : ref17.y.z) || void 0 === ref18 || ref18.w, o5.x.y, o5.x.y.z.w), o5.x, null === (ref4 = o5.x) || void 0 === ref4 || ref4.y, null === (ref5 = o5.x) || void 0 === ref5 || ref5.y.z, null === (ref7 = null === (ref6 = o5.x) || void 0 === ref6 ? void 0 : ref6.y.z) || void 0 === ref7 || ref7.w, o5.x.y, o5.x.y.z.w, (null == o6 ? void 0 : o6.f()) || null == o6 || o6.f, o6.f, null == o6 || o6.f, o6.f;
var ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, a, b, c, d, ref9, ref10, ref11, ref12, ref13, ref14, ref15, ref16, ref17, ref18, lastSomeProperty, ref19, someObject = {
    someProperty: 42
};
someFunction(someObject), someFunction(void 0);
for(var i = 0; (null === (ref8 = arr[i]) || void 0 === ref8 ? void 0 : ref8.tag) === "left";)i += 1, (null === (ref19 = arr[i]) || void 0 === ref19 ? void 0 : ref19.tag) === "right" && console.log("I should ALSO be reachable");

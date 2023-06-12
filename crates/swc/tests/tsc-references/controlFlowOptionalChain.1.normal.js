//// [controlFlowOptionalChain.ts]
// assignments in shortcutting chain
import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
import { _ as _type_of } from "@swc/helpers/_/_type_of";
var _o, _o_x, _o1, _o_x1, _object, _f, _o2_f, _object1, _o2, _o3, _o31, _o4_x, _o4_x1, _o5_x_y_z, _o5_x_y, _o5_x, _o5_x_y1, _o5_x_y_z1, _o5_x_y2, _o6_f, _object2, _o6, _arr_i;
var a;
(_o = o) === null || _o === void 0 ? void 0 : _o[a = 1];
a.toString();
var b;
(_o_x = o) === null || _o_x === void 0 ? void 0 : _o_x.x[b = 1];
b.toString();
var c;
(_o1 = o) === null || _o1 === void 0 ? void 0 : _o1(c = 1);
c.toString();
var d;
(_object = o) === null || _object === void 0 ? void 0 : (_o_x1 = _object.x) === null || _o_x1 === void 0 ? void 0 : _o_x1.call(_object, d = 1);
d.toString();
if ((_f = f) === null || _f === void 0 ? void 0 : _f(x)) {
    x; // number
    f; // (x: any) => x is number
    f(x);
} else {
    x;
    f;
    f(x);
}
x;
f;
f(x);
if ((_object1 = o2) === null || _object1 === void 0 ? void 0 : (_o2_f = _object1.f) === null || _o2_f === void 0 ? void 0 : _o2_f.call(_object1, x)) {
    var _o21, _o2_f1, _object3;
    x; // number
    o2.f; // (x: any) => x is number
    (_o21 = o2) === null || _o21 === void 0 ? void 0 : _o21.f;
    (_object3 = o2) === null || _object3 === void 0 ? void 0 : (_o2_f1 = _object3.f) === null || _o2_f1 === void 0 ? void 0 : _o2_f1.call(_object3, x);
} else {
    var _o22;
    x;
    o2;
    (_o22 = o2) === null || _o22 === void 0 ? void 0 : _o22.f;
    o2.f;
}
x;
o2;
(_o2 = o2) === null || _o2 === void 0 ? void 0 : _o2.f;
o2.f;
if (((_o3 = o3) === null || _o3 === void 0 ? void 0 : _o3.x) === 1) {
    var _o32;
    o3;
    o3.x;
    (_o32 = o3) === null || _o32 === void 0 ? void 0 : _o32.x;
} else {
    var _o33;
    o3;
    (_o33 = o3) === null || _o33 === void 0 ? void 0 : _o33.x;
    o3.x;
}
o3;
(_o31 = o3) === null || _o31 === void 0 ? void 0 : _o31.x;
o3.x;
if ((_o4_x = o4.x) === null || _o4_x === void 0 ? void 0 : _o4_x.y) {
    var _o4_x2;
    o4.x; // { y: boolean }
    o4.x.y; // true
    (_o4_x2 = o4.x) === null || _o4_x2 === void 0 ? void 0 : _o4_x2.y; // true
} else {
    var _o4_x3;
    o4.x;
    (_o4_x3 = o4.x) === null || _o4_x3 === void 0 ? void 0 : _o4_x3.y;
    o4.x.y;
}
o4.x;
(_o4_x1 = o4.x) === null || _o4_x1 === void 0 ? void 0 : _o4_x1.y;
o4.x.y;
if ((_o5_x_y_z = (_o5_x_y = o5.x) === null || _o5_x_y === void 0 ? void 0 : _o5_x_y.y.z) === null || _o5_x_y_z === void 0 ? void 0 : _o5_x_y_z.w) {
    var _o5_x_y_z2, _o5_x_y_z3, _o5_x_y_z4, _o5_x_y3;
    o5.x;
    o5.x.y;
    o5.x.y.z;
    o5.x.y.z.w; // true
    (_o5_x_y_z2 = o5.x.y.z) === null || _o5_x_y_z2 === void 0 ? void 0 : _o5_x_y_z2.w; // true
    (_o5_x_y_z3 = o5.x) === null || _o5_x_y_z3 === void 0 ? void 0 : _o5_x_y_z3.y.z.w; // true
    (_o5_x_y_z4 = (_o5_x_y3 = o5.x) === null || _o5_x_y3 === void 0 ? void 0 : _o5_x_y3.y.z) === null || _o5_x_y_z4 === void 0 ? void 0 : _o5_x_y_z4.w; // true
} else {
    var _o5_x1, _o5_x_y4, _o5_x_y_z5, _o5_x_y5;
    o5.x;
    (_o5_x1 = o5.x) === null || _o5_x1 === void 0 ? void 0 : _o5_x1.y;
    (_o5_x_y4 = o5.x) === null || _o5_x_y4 === void 0 ? void 0 : _o5_x_y4.y.z;
    (_o5_x_y_z5 = (_o5_x_y5 = o5.x) === null || _o5_x_y5 === void 0 ? void 0 : _o5_x_y5.y.z) === null || _o5_x_y_z5 === void 0 ? void 0 : _o5_x_y_z5.w;
    o5.x.y;
    o5.x.y.z.w;
}
o5.x;
(_o5_x = o5.x) === null || _o5_x === void 0 ? void 0 : _o5_x.y;
(_o5_x_y1 = o5.x) === null || _o5_x_y1 === void 0 ? void 0 : _o5_x_y1.y.z;
(_o5_x_y_z1 = (_o5_x_y2 = o5.x) === null || _o5_x_y2 === void 0 ? void 0 : _o5_x_y2.y.z) === null || _o5_x_y_z1 === void 0 ? void 0 : _o5_x_y_z1.w;
o5.x.y;
o5.x.y.z.w;
if ((_object2 = o6) === null || _object2 === void 0 ? void 0 : (_o6_f = _object2.f) === null || _o6_f === void 0 ? void 0 : _o6_f.call(_object2)) {
    o6; // Derived
    o6.f;
} else {
    var _o61;
    o6;
    (_o61 = o6) === null || _o61 === void 0 ? void 0 : _o61.f;
    o6.f;
}
o6;
(_o6 = o6) === null || _o6 === void 0 ? void 0 : _o6.f;
o6.f;
function f01(x1) {
    if (!!true) {
        var _isString;
        (_isString = isString) === null || _isString === void 0 ? void 0 : _isString(x1);
        x1;
    }
    if (!!true) {
        var _maybeIsString;
        (_maybeIsString = maybeIsString) === null || _maybeIsString === void 0 ? void 0 : _maybeIsString(x1);
        x1;
    }
    if (!!true) {
        var _maybeIsString1;
        isDefined(maybeIsString);
        (_maybeIsString1 = maybeIsString) === null || _maybeIsString1 === void 0 ? void 0 : _maybeIsString1(x1);
        x1;
    }
    if (!!true) {
        var _maybeNever;
        (_maybeNever = maybeNever) === null || _maybeNever === void 0 ? void 0 : _maybeNever();
        x1;
    }
}
function f10(o1, value) {
    var _o, _o1, _o_bar, _object, _o2, _o3, _o_bar1, _object1;
    if (((_o = o1) === null || _o === void 0 ? void 0 : _o.foo) === value) {
        o1.foo;
    }
    if (((_o1 = o1) === null || _o1 === void 0 ? void 0 : _o1["foo"]) === value) {
        o1["foo"];
    }
    if (((_object = o1) === null || _object === void 0 ? void 0 : (_o_bar = _object.bar) === null || _o_bar === void 0 ? void 0 : _o_bar.call(_object)) === value) {
        o1.bar;
    }
    if (((_o2 = o1) === null || _o2 === void 0 ? void 0 : _o2.foo) == value) {
        o1.foo;
    }
    if (((_o3 = o1) === null || _o3 === void 0 ? void 0 : _o3["foo"]) == value) {
        o1["foo"];
    }
    if (((_object1 = o1) === null || _object1 === void 0 ? void 0 : (_o_bar1 = _object1.bar) === null || _o_bar1 === void 0 ? void 0 : _o_bar1.call(_object1)) == value) {
        o1.bar;
    }
}
function f11(o1, value) {
    var _o, _o1, _o_bar, _object, _o2, _o3, _o_bar1, _object1;
    if (((_o = o1) === null || _o === void 0 ? void 0 : _o.foo) === value) {
        o1.foo;
    }
    if (((_o1 = o1) === null || _o1 === void 0 ? void 0 : _o1["foo"]) === value) {
        o1["foo"];
    }
    if (((_object = o1) === null || _object === void 0 ? void 0 : (_o_bar = _object.bar) === null || _o_bar === void 0 ? void 0 : _o_bar.call(_object)) === value) {
        o1.bar;
    }
    if (((_o2 = o1) === null || _o2 === void 0 ? void 0 : _o2.foo) == value) {
        o1.foo;
    }
    if (((_o3 = o1) === null || _o3 === void 0 ? void 0 : _o3["foo"]) == value) {
        o1["foo"];
    }
    if (((_object1 = o1) === null || _object1 === void 0 ? void 0 : (_o_bar1 = _object1.bar) === null || _o_bar1 === void 0 ? void 0 : _o_bar1.call(_object1)) == value) {
        o1.bar;
    }
}
function f12(o1, value) {
    var _o, _o1, _o_bar, _object, _o2, _o3, _o_bar1, _object1;
    if (((_o = o1) === null || _o === void 0 ? void 0 : _o.foo) === value) {
        o1.foo; // Error
    }
    if (((_o1 = o1) === null || _o1 === void 0 ? void 0 : _o1["foo"]) === value) {
        o1["foo"]; // Error
    }
    if (((_object = o1) === null || _object === void 0 ? void 0 : (_o_bar = _object.bar) === null || _o_bar === void 0 ? void 0 : _o_bar.call(_object)) === value) {
        o1.bar; // Error
    }
    if (((_o2 = o1) === null || _o2 === void 0 ? void 0 : _o2.foo) == value) {
        o1.foo; // Error
    }
    if (((_o3 = o1) === null || _o3 === void 0 ? void 0 : _o3["foo"]) == value) {
        o1["foo"]; // Error
    }
    if (((_object1 = o1) === null || _object1 === void 0 ? void 0 : (_o_bar1 = _object1.bar) === null || _o_bar1 === void 0 ? void 0 : _o_bar1.call(_object1)) == value) {
        o1.bar; // Error
    }
}
function f12a(o1, value) {
    var _o, _o1, _o_bar, _object, _o2, _o3, _o_bar1, _object1;
    if (((_o = o1) === null || _o === void 0 ? void 0 : _o.foo) === value) {
        o1.foo;
    }
    if (((_o1 = o1) === null || _o1 === void 0 ? void 0 : _o1["foo"]) === value) {
        o1["foo"];
    }
    if (((_object = o1) === null || _object === void 0 ? void 0 : (_o_bar = _object.bar) === null || _o_bar === void 0 ? void 0 : _o_bar.call(_object)) === value) {
        o1.bar;
    }
    if (((_o2 = o1) === null || _o2 === void 0 ? void 0 : _o2.foo) == value) {
        o1.foo; // Error
    }
    if (((_o3 = o1) === null || _o3 === void 0 ? void 0 : _o3["foo"]) == value) {
        o1["foo"]; // Error
    }
    if (((_object1 = o1) === null || _object1 === void 0 ? void 0 : (_o_bar1 = _object1.bar) === null || _o_bar1 === void 0 ? void 0 : _o_bar1.call(_object1)) == value) {
        o1.bar; // Error
    }
}
function f13(o1) {
    var _o, _o1, _o_bar, _object, _o2, _o3, _o_bar1, _object1;
    if (((_o = o1) === null || _o === void 0 ? void 0 : _o.foo) !== undefined) {
        o1.foo;
    }
    if (((_o1 = o1) === null || _o1 === void 0 ? void 0 : _o1["foo"]) !== undefined) {
        o1["foo"];
    }
    if (((_object = o1) === null || _object === void 0 ? void 0 : (_o_bar = _object.bar) === null || _o_bar === void 0 ? void 0 : _o_bar.call(_object)) !== undefined) {
        o1.bar;
    }
    if (((_o2 = o1) === null || _o2 === void 0 ? void 0 : _o2.foo) != undefined) {
        o1.foo;
    }
    if (((_o3 = o1) === null || _o3 === void 0 ? void 0 : _o3["foo"]) != undefined) {
        o1["foo"];
    }
    if (((_object1 = o1) === null || _object1 === void 0 ? void 0 : (_o_bar1 = _object1.bar) === null || _o_bar1 === void 0 ? void 0 : _o_bar1.call(_object1)) != undefined) {
        o1.bar;
    }
}
function f13a(o1) {
    var _o, _o1, _o_bar, _object, _o2, _o3, _o_bar1, _object1;
    if (((_o = o1) === null || _o === void 0 ? void 0 : _o.foo) !== null) {
        o1.foo; // Error
    }
    if (((_o1 = o1) === null || _o1 === void 0 ? void 0 : _o1["foo"]) !== null) {
        o1["foo"]; // Error
    }
    if (((_object = o1) === null || _object === void 0 ? void 0 : (_o_bar = _object.bar) === null || _o_bar === void 0 ? void 0 : _o_bar.call(_object)) !== null) {
        o1.bar; // Error
    }
    if (((_o2 = o1) === null || _o2 === void 0 ? void 0 : _o2.foo) != null) {
        o1.foo;
    }
    if (((_o3 = o1) === null || _o3 === void 0 ? void 0 : _o3["foo"]) != null) {
        o1["foo"];
    }
    if (((_object1 = o1) === null || _object1 === void 0 ? void 0 : (_o_bar1 = _object1.bar) === null || _o_bar1 === void 0 ? void 0 : _o_bar1.call(_object1)) != null) {
        o1.bar;
    }
}
function f14(o1) {
    var _o, _o1, _o_bar, _object;
    if (((_o = o1) === null || _o === void 0 ? void 0 : _o.foo) !== undefined) {
        o1.foo;
    }
    if (((_o1 = o1) === null || _o1 === void 0 ? void 0 : _o1["foo"]) !== undefined) {
        o1["foo"];
    }
    if (((_object = o1) === null || _object === void 0 ? void 0 : (_o_bar = _object.bar) === null || _o_bar === void 0 ? void 0 : _o_bar.call(_object)) !== undefined) {
        o1.bar;
    }
}
function f15(o1, value) {
    var _o, _o1, _o2, _o3;
    if (((_o = o1) === null || _o === void 0 ? void 0 : _o.foo) === value) {
        o1.foo;
    } else {
        o1.foo; // Error
    }
    if (((_o1 = o1) === null || _o1 === void 0 ? void 0 : _o1.foo) !== value) {
        o1.foo; // Error
    } else {
        o1.foo;
    }
    if (((_o2 = o1) === null || _o2 === void 0 ? void 0 : _o2.foo) == value) {
        o1.foo;
    } else {
        o1.foo; // Error
    }
    if (((_o3 = o1) === null || _o3 === void 0 ? void 0 : _o3.foo) != value) {
        o1.foo; // Error
    } else {
        o1.foo;
    }
}
function f15a(o1, value) {
    var _o, _o1, _o2, _o3;
    if (((_o = o1) === null || _o === void 0 ? void 0 : _o.foo) === value) {
        o1.foo; // Error
    } else {
        o1.foo; // Error
    }
    if (((_o1 = o1) === null || _o1 === void 0 ? void 0 : _o1.foo) !== value) {
        o1.foo; // Error
    } else {
        o1.foo; // Error
    }
    if (((_o2 = o1) === null || _o2 === void 0 ? void 0 : _o2.foo) == value) {
        o1.foo; // Error
    } else {
        o1.foo; // Error
    }
    if (((_o3 = o1) === null || _o3 === void 0 ? void 0 : _o3.foo) != value) {
        o1.foo; // Error
    } else {
        o1.foo; // Error
    }
}
function f16(o1) {
    var _o, _o1, _o2, _o3;
    if (((_o = o1) === null || _o === void 0 ? void 0 : _o.foo) === undefined) {
        o1.foo; // Error
    } else {
        o1.foo;
    }
    if (((_o1 = o1) === null || _o1 === void 0 ? void 0 : _o1.foo) !== undefined) {
        o1.foo;
    } else {
        o1.foo; // Error
    }
    if (((_o2 = o1) === null || _o2 === void 0 ? void 0 : _o2.foo) == undefined) {
        o1.foo; // Error
    } else {
        o1.foo;
    }
    if (((_o3 = o1) === null || _o3 === void 0 ? void 0 : _o3.foo) != undefined) {
        o1.foo;
    } else {
        o1.foo; // Error
    }
}
function f20(o1) {
    var _o, _o1, _o_bar, _object, _o2;
    if (typeof ((_o = o1) === null || _o === void 0 ? void 0 : _o.foo) === "number") {
        o1.foo;
    }
    if (typeof ((_o1 = o1) === null || _o1 === void 0 ? void 0 : _o1["foo"]) === "number") {
        o1["foo"];
    }
    if (typeof ((_object = o1) === null || _object === void 0 ? void 0 : (_o_bar = _object.bar) === null || _o_bar === void 0 ? void 0 : _o_bar.call(_object)) === "number") {
        o1.bar;
    }
    if (_instanceof((_o2 = o1) === null || _o2 === void 0 ? void 0 : _o2.baz, Error)) {
        o1.baz;
    }
}
function f21(o1) {
    var _o, _o1, _o_bar, _object, _o2;
    if (typeof ((_o = o1) === null || _o === void 0 ? void 0 : _o.foo) === "number") {
        o1.foo;
    }
    if (typeof ((_o1 = o1) === null || _o1 === void 0 ? void 0 : _o1["foo"]) === "number") {
        o1["foo"];
    }
    if (typeof ((_object = o1) === null || _object === void 0 ? void 0 : (_o_bar = _object.bar) === null || _o_bar === void 0 ? void 0 : _o_bar.call(_object)) === "number") {
        o1.bar;
    }
    if (_instanceof((_o2 = o1) === null || _o2 === void 0 ? void 0 : _o2.baz, Error)) {
        o1.baz;
    }
}
function f22(o1) {
    var _o, _o1, _o2, _o3;
    if (typeof ((_o = o1) === null || _o === void 0 ? void 0 : _o.foo) === "number") {
        o1.foo;
    } else {
        o1.foo; // Error
    }
    if (typeof ((_o1 = o1) === null || _o1 === void 0 ? void 0 : _o1.foo) !== "number") {
        o1.foo; // Error
    } else {
        o1.foo;
    }
    if (typeof ((_o2 = o1) === null || _o2 === void 0 ? void 0 : _o2.foo) == "number") {
        o1.foo;
    } else {
        o1.foo; // Error
    }
    if (typeof ((_o3 = o1) === null || _o3 === void 0 ? void 0 : _o3.foo) != "number") {
        o1.foo; // Error
    } else {
        o1.foo;
    }
}
function f23(o1) {
    var _o, _o1, _o2, _o3;
    if (typeof ((_o = o1) === null || _o === void 0 ? void 0 : _o.foo) === "undefined") {
        o1.foo; // Error
    } else {
        o1.foo;
    }
    if (typeof ((_o1 = o1) === null || _o1 === void 0 ? void 0 : _o1.foo) !== "undefined") {
        o1.foo;
    } else {
        o1.foo; // Error
    }
    if (typeof ((_o2 = o1) === null || _o2 === void 0 ? void 0 : _o2.foo) == "undefined") {
        o1.foo; // Error
    } else {
        o1.foo;
    }
    if (typeof ((_o3 = o1) === null || _o3 === void 0 ? void 0 : _o3.foo) != "undefined") {
        o1.foo;
    } else {
        o1.foo; // Error
    }
}
function f30(o1) {
    if (!!true) {
        var _o;
        assert((_o = o1) === null || _o === void 0 ? void 0 : _o.foo);
        o1.foo;
    }
    if (!!true) {
        var _o1;
        assert(((_o1 = o1) === null || _o1 === void 0 ? void 0 : _o1.foo) === 42);
        o1.foo;
    }
    if (!!true) {
        var _o2;
        assert(typeof ((_o2 = o1) === null || _o2 === void 0 ? void 0 : _o2.foo) === "number");
        o1.foo;
    }
    if (!!true) {
        var _o3;
        assertNonNull((_o3 = o1) === null || _o3 === void 0 ? void 0 : _o3.foo);
        o1.foo;
    }
}
function f40(o1) {
    var _o;
    switch((_o = o1) === null || _o === void 0 ? void 0 : _o.foo){
        case "abc":
            o1.foo;
            break;
        case 42:
            o1.foo;
            break;
        case undefined:
            o1.foo; // Error
            break;
        default:
            o1.foo; // Error
            break;
    }
}
function f41(o1) {
    var _o;
    switch(_type_of((_o = o1) === null || _o === void 0 ? void 0 : _o.foo)){
        case "string":
            o1.foo;
            break;
        case "number":
            o1.foo;
            break;
        case "undefined":
            o1.foo; // Error
            break;
        default:
            o1.foo; // Error
            break;
    }
}
function getArea(shape) {
    var _shape;
    switch((_shape = shape) === null || _shape === void 0 ? void 0 : _shape.type){
        case "circle":
            return Math.PI * Math.pow(shape.radius, 2);
        case "rectangle":
            return shape.width * shape.height;
        default:
            return 0;
    }
}
function extractCoordinates(f1) {
    var _f_geometry;
    if (((_f_geometry = f1.geometry) === null || _f_geometry === void 0 ? void 0 : _f_geometry.type) !== "test") {
        return [];
    }
    return f1.geometry.coordinates;
}
var lastSomeProperty;
function someFunction(someOptionalObject) {
    var _someOptionalObject;
    if (((_someOptionalObject = someOptionalObject) === null || _someOptionalObject === void 0 ? void 0 : _someOptionalObject.someProperty) !== lastSomeProperty) {
        var _someOptionalObject1;
        console.log(someOptionalObject);
        console.log(someOptionalObject.someProperty); // Error
        lastSomeProperty = (_someOptionalObject1 = someOptionalObject) === null || _someOptionalObject1 === void 0 ? void 0 : _someOptionalObject1.someProperty;
    }
}
var someObject = {
    someProperty: 42
};
someFunction(someObject);
someFunction(undefined);
// Repro from #35970
var i = 0;
while(((_arr_i = arr[i]) === null || _arr_i === void 0 ? void 0 : _arr_i.tag) === "left"){
    var _arr_i1;
    i += 1;
    if (((_arr_i1 = arr[i]) === null || _arr_i1 === void 0 ? void 0 : _arr_i1.tag) === "right") {
        console.log("I should ALSO be reachable");
    }
}
function f50(obj) {
    var _obj_main;
    for(var key in (_obj_main = obj.main) === null || _obj_main === void 0 ? void 0 : _obj_main.childs){
        if (obj.main.childs[key] === obj) {
            return obj;
        }
    }
    return null;
}

//// [controlFlowOptionalChain.ts]
// assignments in shortcutting chain
import _instanceof from "@swc/helpers/src/_instanceof.mjs";
import _type_of from "@swc/helpers/src/_type_of.mjs";
var _o4_x, _o4_x1, _o5_x, _ref, _o5_x1, _o5_x2, _o5_x3, _ref1, _arr_i;
var a;
o === null || o === void 0 ? void 0 : o[a = 1];
a.toString();
var b;
o === null || o === void 0 ? void 0 : o.x[b = 1];
b.toString();
var c;
o === null || o === void 0 ? void 0 : o(c = 1);
c.toString();
var d;
o === null || o === void 0 ? void 0 : o.x(d = 1);
d.toString();
if (f === null || f === void 0 ? void 0 : f(x)) {
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
if (o2 === null || o2 === void 0 ? void 0 : o2.f(x)) {
    x; // number
    o2.f; // (x: any) => x is number
    o2 === null || o2 === void 0 ? void 0 : o2.f;
    o2 === null || o2 === void 0 ? void 0 : o2.f(x);
} else {
    x;
    o2;
    o2 === null || o2 === void 0 ? void 0 : o2.f;
    o2.f;
}
x;
o2;
o2 === null || o2 === void 0 ? void 0 : o2.f;
o2.f;
if ((o3 === null || o3 === void 0 ? void 0 : o3.x) === 1) {
    o3;
    o3.x;
    o3 === null || o3 === void 0 ? void 0 : o3.x;
} else {
    o3;
    o3 === null || o3 === void 0 ? void 0 : o3.x;
    o3.x;
}
o3;
o3 === null || o3 === void 0 ? void 0 : o3.x;
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
if ((_ref = (_o5_x = o5.x) === null || _o5_x === void 0 ? void 0 : _o5_x.y.z) === null || _ref === void 0 ? void 0 : _ref.w) {
    var _o5_x_y_z, _o5_x4, _o5_x5, _ref2;
    o5.x;
    o5.x.y;
    o5.x.y.z;
    o5.x.y.z.w; // true
    (_o5_x_y_z = o5.x.y.z) === null || _o5_x_y_z === void 0 ? void 0 : _o5_x_y_z.w; // true
    (_o5_x4 = o5.x) === null || _o5_x4 === void 0 ? void 0 : _o5_x4.y.z.w; // true
    (_ref2 = (_o5_x5 = o5.x) === null || _o5_x5 === void 0 ? void 0 : _o5_x5.y.z) === null || _ref2 === void 0 ? void 0 : _ref2.w; // true
} else {
    var _o5_x6, _o5_x7, _o5_x8, _ref3;
    o5.x;
    (_o5_x6 = o5.x) === null || _o5_x6 === void 0 ? void 0 : _o5_x6.y;
    (_o5_x7 = o5.x) === null || _o5_x7 === void 0 ? void 0 : _o5_x7.y.z;
    (_ref3 = (_o5_x8 = o5.x) === null || _o5_x8 === void 0 ? void 0 : _o5_x8.y.z) === null || _ref3 === void 0 ? void 0 : _ref3.w;
    o5.x.y;
    o5.x.y.z.w;
}
o5.x;
(_o5_x1 = o5.x) === null || _o5_x1 === void 0 ? void 0 : _o5_x1.y;
(_o5_x2 = o5.x) === null || _o5_x2 === void 0 ? void 0 : _o5_x2.y.z;
(_ref1 = (_o5_x3 = o5.x) === null || _o5_x3 === void 0 ? void 0 : _o5_x3.y.z) === null || _ref1 === void 0 ? void 0 : _ref1.w;
o5.x.y;
o5.x.y.z.w;
if (o6 === null || o6 === void 0 ? void 0 : o6.f()) {
    o6; // Derived
    o6.f;
} else {
    o6;
    o6 === null || o6 === void 0 ? void 0 : o6.f;
    o6.f;
}
o6;
o6 === null || o6 === void 0 ? void 0 : o6.f;
o6.f;
function f01(x1) {
    if (!!true) {
        isString === null || isString === void 0 ? void 0 : isString(x1);
        x1;
    }
    if (!!true) {
        maybeIsString === null || maybeIsString === void 0 ? void 0 : maybeIsString(x1);
        x1;
    }
    if (!!true) {
        isDefined(maybeIsString);
        maybeIsString === null || maybeIsString === void 0 ? void 0 : maybeIsString(x1);
        x1;
    }
    if (!!true) {
        maybeNever === null || maybeNever === void 0 ? void 0 : maybeNever();
        x1;
    }
}
function f10(o1, value) {
    if ((o1 === null || o1 === void 0 ? void 0 : o1.foo) === value) {
        o1.foo;
    }
    if ((o1 === null || o1 === void 0 ? void 0 : o1["foo"]) === value) {
        o1["foo"];
    }
    if ((o1 === null || o1 === void 0 ? void 0 : o1.bar()) === value) {
        o1.bar;
    }
    if ((o1 === null || o1 === void 0 ? void 0 : o1.foo) == value) {
        o1.foo;
    }
    if ((o1 === null || o1 === void 0 ? void 0 : o1["foo"]) == value) {
        o1["foo"];
    }
    if ((o1 === null || o1 === void 0 ? void 0 : o1.bar()) == value) {
        o1.bar;
    }
}
function f11(o1, value) {
    if ((o1 === null || o1 === void 0 ? void 0 : o1.foo) === value) {
        o1.foo;
    }
    if ((o1 === null || o1 === void 0 ? void 0 : o1["foo"]) === value) {
        o1["foo"];
    }
    if ((o1 === null || o1 === void 0 ? void 0 : o1.bar()) === value) {
        o1.bar;
    }
    if ((o1 === null || o1 === void 0 ? void 0 : o1.foo) == value) {
        o1.foo;
    }
    if ((o1 === null || o1 === void 0 ? void 0 : o1["foo"]) == value) {
        o1["foo"];
    }
    if ((o1 === null || o1 === void 0 ? void 0 : o1.bar()) == value) {
        o1.bar;
    }
}
function f12(o1, value) {
    if ((o1 === null || o1 === void 0 ? void 0 : o1.foo) === value) {
        o1.foo; // Error
    }
    if ((o1 === null || o1 === void 0 ? void 0 : o1["foo"]) === value) {
        o1["foo"]; // Error
    }
    if ((o1 === null || o1 === void 0 ? void 0 : o1.bar()) === value) {
        o1.bar; // Error
    }
    if ((o1 === null || o1 === void 0 ? void 0 : o1.foo) == value) {
        o1.foo; // Error
    }
    if ((o1 === null || o1 === void 0 ? void 0 : o1["foo"]) == value) {
        o1["foo"]; // Error
    }
    if ((o1 === null || o1 === void 0 ? void 0 : o1.bar()) == value) {
        o1.bar; // Error
    }
}
function f12a(o1, value) {
    if ((o1 === null || o1 === void 0 ? void 0 : o1.foo) === value) {
        o1.foo;
    }
    if ((o1 === null || o1 === void 0 ? void 0 : o1["foo"]) === value) {
        o1["foo"];
    }
    if ((o1 === null || o1 === void 0 ? void 0 : o1.bar()) === value) {
        o1.bar;
    }
    if ((o1 === null || o1 === void 0 ? void 0 : o1.foo) == value) {
        o1.foo; // Error
    }
    if ((o1 === null || o1 === void 0 ? void 0 : o1["foo"]) == value) {
        o1["foo"]; // Error
    }
    if ((o1 === null || o1 === void 0 ? void 0 : o1.bar()) == value) {
        o1.bar; // Error
    }
}
function f13(o1) {
    if ((o1 === null || o1 === void 0 ? void 0 : o1.foo) !== undefined) {
        o1.foo;
    }
    if ((o1 === null || o1 === void 0 ? void 0 : o1["foo"]) !== undefined) {
        o1["foo"];
    }
    if ((o1 === null || o1 === void 0 ? void 0 : o1.bar()) !== undefined) {
        o1.bar;
    }
    if ((o1 === null || o1 === void 0 ? void 0 : o1.foo) != undefined) {
        o1.foo;
    }
    if ((o1 === null || o1 === void 0 ? void 0 : o1["foo"]) != undefined) {
        o1["foo"];
    }
    if ((o1 === null || o1 === void 0 ? void 0 : o1.bar()) != undefined) {
        o1.bar;
    }
}
function f13a(o1) {
    if ((o1 === null || o1 === void 0 ? void 0 : o1.foo) !== null) {
        o1.foo; // Error
    }
    if ((o1 === null || o1 === void 0 ? void 0 : o1["foo"]) !== null) {
        o1["foo"]; // Error
    }
    if ((o1 === null || o1 === void 0 ? void 0 : o1.bar()) !== null) {
        o1.bar; // Error
    }
    if ((o1 === null || o1 === void 0 ? void 0 : o1.foo) != null) {
        o1.foo;
    }
    if ((o1 === null || o1 === void 0 ? void 0 : o1["foo"]) != null) {
        o1["foo"];
    }
    if ((o1 === null || o1 === void 0 ? void 0 : o1.bar()) != null) {
        o1.bar;
    }
}
function f14(o1) {
    if ((o1 === null || o1 === void 0 ? void 0 : o1.foo) !== undefined) {
        o1.foo;
    }
    if ((o1 === null || o1 === void 0 ? void 0 : o1["foo"]) !== undefined) {
        o1["foo"];
    }
    if ((o1 === null || o1 === void 0 ? void 0 : o1.bar()) !== undefined) {
        o1.bar;
    }
}
function f15(o1, value) {
    if ((o1 === null || o1 === void 0 ? void 0 : o1.foo) === value) {
        o1.foo;
    } else {
        o1.foo; // Error
    }
    if ((o1 === null || o1 === void 0 ? void 0 : o1.foo) !== value) {
        o1.foo; // Error
    } else {
        o1.foo;
    }
    if ((o1 === null || o1 === void 0 ? void 0 : o1.foo) == value) {
        o1.foo;
    } else {
        o1.foo; // Error
    }
    if ((o1 === null || o1 === void 0 ? void 0 : o1.foo) != value) {
        o1.foo; // Error
    } else {
        o1.foo;
    }
}
function f15a(o1, value) {
    if ((o1 === null || o1 === void 0 ? void 0 : o1.foo) === value) {
        o1.foo; // Error
    } else {
        o1.foo; // Error
    }
    if ((o1 === null || o1 === void 0 ? void 0 : o1.foo) !== value) {
        o1.foo; // Error
    } else {
        o1.foo; // Error
    }
    if ((o1 === null || o1 === void 0 ? void 0 : o1.foo) == value) {
        o1.foo; // Error
    } else {
        o1.foo; // Error
    }
    if ((o1 === null || o1 === void 0 ? void 0 : o1.foo) != value) {
        o1.foo; // Error
    } else {
        o1.foo; // Error
    }
}
function f16(o1) {
    if ((o1 === null || o1 === void 0 ? void 0 : o1.foo) === undefined) {
        o1.foo; // Error
    } else {
        o1.foo;
    }
    if ((o1 === null || o1 === void 0 ? void 0 : o1.foo) !== undefined) {
        o1.foo;
    } else {
        o1.foo; // Error
    }
    if ((o1 === null || o1 === void 0 ? void 0 : o1.foo) == undefined) {
        o1.foo; // Error
    } else {
        o1.foo;
    }
    if ((o1 === null || o1 === void 0 ? void 0 : o1.foo) != undefined) {
        o1.foo;
    } else {
        o1.foo; // Error
    }
}
function f20(o1) {
    if (typeof (o1 === null || o1 === void 0 ? void 0 : o1.foo) === "number") {
        o1.foo;
    }
    if (typeof (o1 === null || o1 === void 0 ? void 0 : o1["foo"]) === "number") {
        o1["foo"];
    }
    if (typeof (o1 === null || o1 === void 0 ? void 0 : o1.bar()) === "number") {
        o1.bar;
    }
    if (_instanceof(o1 === null || o1 === void 0 ? void 0 : o1.baz, Error)) {
        o1.baz;
    }
}
function f21(o1) {
    if (typeof (o1 === null || o1 === void 0 ? void 0 : o1.foo) === "number") {
        o1.foo;
    }
    if (typeof (o1 === null || o1 === void 0 ? void 0 : o1["foo"]) === "number") {
        o1["foo"];
    }
    if (typeof (o1 === null || o1 === void 0 ? void 0 : o1.bar()) === "number") {
        o1.bar;
    }
    if (_instanceof(o1 === null || o1 === void 0 ? void 0 : o1.baz, Error)) {
        o1.baz;
    }
}
function f22(o1) {
    if (typeof (o1 === null || o1 === void 0 ? void 0 : o1.foo) === "number") {
        o1.foo;
    } else {
        o1.foo; // Error
    }
    if (typeof (o1 === null || o1 === void 0 ? void 0 : o1.foo) !== "number") {
        o1.foo; // Error
    } else {
        o1.foo;
    }
    if (typeof (o1 === null || o1 === void 0 ? void 0 : o1.foo) == "number") {
        o1.foo;
    } else {
        o1.foo; // Error
    }
    if (typeof (o1 === null || o1 === void 0 ? void 0 : o1.foo) != "number") {
        o1.foo; // Error
    } else {
        o1.foo;
    }
}
function f23(o1) {
    if (typeof (o1 === null || o1 === void 0 ? void 0 : o1.foo) === "undefined") {
        o1.foo; // Error
    } else {
        o1.foo;
    }
    if (typeof (o1 === null || o1 === void 0 ? void 0 : o1.foo) !== "undefined") {
        o1.foo;
    } else {
        o1.foo; // Error
    }
    if (typeof (o1 === null || o1 === void 0 ? void 0 : o1.foo) == "undefined") {
        o1.foo; // Error
    } else {
        o1.foo;
    }
    if (typeof (o1 === null || o1 === void 0 ? void 0 : o1.foo) != "undefined") {
        o1.foo;
    } else {
        o1.foo; // Error
    }
}
function f30(o1) {
    if (!!true) {
        assert(o1 === null || o1 === void 0 ? void 0 : o1.foo);
        o1.foo;
    }
    if (!!true) {
        assert((o1 === null || o1 === void 0 ? void 0 : o1.foo) === 42);
        o1.foo;
    }
    if (!!true) {
        assert(typeof (o1 === null || o1 === void 0 ? void 0 : o1.foo) === "number");
        o1.foo;
    }
    if (!!true) {
        assertNonNull(o1 === null || o1 === void 0 ? void 0 : o1.foo);
        o1.foo;
    }
}
function f40(o1) {
    switch(o1 === null || o1 === void 0 ? void 0 : o1.foo){
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
    switch(_type_of(o1 === null || o1 === void 0 ? void 0 : o1.foo)){
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
    switch(shape === null || shape === void 0 ? void 0 : shape.type){
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
    if ((someOptionalObject === null || someOptionalObject === void 0 ? void 0 : someOptionalObject.someProperty) !== lastSomeProperty) {
        console.log(someOptionalObject);
        console.log(someOptionalObject.someProperty); // Error
        lastSomeProperty = someOptionalObject === null || someOptionalObject === void 0 ? void 0 : someOptionalObject.someProperty;
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

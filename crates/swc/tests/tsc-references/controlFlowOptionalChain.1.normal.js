//// [controlFlowOptionalChain.ts]
// assignments in shortcutting chain
import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
import { _ as _type_of } from "@swc/helpers/_/_type_of";
var _o, _o1, _o2, _o3, _f, _o21, _o22, _o31, _o32, _o4_x, _o4_x1, _o5_x_y_z, _o5_x, _o5_x1, _o5_x2, _o5_x_y_z1, _o5_x3, _o6, _o61, _arr_i;
var a;
(_o = o) === null || _o === void 0 ? void 0 : _o[a = 1];
a.toString();
var b;
(_o1 = o) === null || _o1 === void 0 ? void 0 : _o1.x[b = 1];
b.toString();
var c;
(_o2 = o) === null || _o2 === void 0 ? void 0 : _o2(c = 1);
c.toString();
var d;
(_o3 = o) === null || _o3 === void 0 ? void 0 : _o3.x(d = 1);
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
if ((_o21 = o2) === null || _o21 === void 0 ? void 0 : _o21.f(x)) {
    var _o23, _o24;
    x; // number
    o2.f; // (x: any) => x is number
    (_o23 = o2) === null || _o23 === void 0 ? void 0 : _o23.f;
    (_o24 = o2) === null || _o24 === void 0 ? void 0 : _o24.f(x);
} else {
    var _o25;
    x;
    o2;
    (_o25 = o2) === null || _o25 === void 0 ? void 0 : _o25.f;
    o2.f;
}
x;
o2;
(_o22 = o2) === null || _o22 === void 0 ? void 0 : _o22.f;
o2.f;
if (((_o31 = o3) === null || _o31 === void 0 ? void 0 : _o31.x) === 1) {
    var _o33;
    o3;
    o3.x;
    (_o33 = o3) === null || _o33 === void 0 ? void 0 : _o33.x;
} else {
    var _o34;
    o3;
    (_o34 = o3) === null || _o34 === void 0 ? void 0 : _o34.x;
    o3.x;
}
o3;
(_o32 = o3) === null || _o32 === void 0 ? void 0 : _o32.x;
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
if ((_o5_x = o5.x) === null || _o5_x === void 0 ? void 0 : (_o5_x_y_z = _o5_x.y.z) === null || _o5_x_y_z === void 0 ? void 0 : _o5_x_y_z.w) {
    var _o5_x_y_z2, _o5_x4, _o5_x_y_z3, _o5_x5;
    o5.x;
    o5.x.y;
    o5.x.y.z;
    o5.x.y.z.w; // true
    (_o5_x_y_z2 = o5.x.y.z) === null || _o5_x_y_z2 === void 0 ? void 0 : _o5_x_y_z2.w; // true
    (_o5_x4 = o5.x) === null || _o5_x4 === void 0 ? void 0 : _o5_x4.y.z.w; // true
    (_o5_x5 = o5.x) === null || _o5_x5 === void 0 ? void 0 : (_o5_x_y_z3 = _o5_x5.y.z) === null || _o5_x_y_z3 === void 0 ? void 0 : _o5_x_y_z3.w; // true
} else {
    var _o5_x6, _o5_x7, _o5_x_y_z4, _o5_x8;
    o5.x;
    (_o5_x6 = o5.x) === null || _o5_x6 === void 0 ? void 0 : _o5_x6.y;
    (_o5_x7 = o5.x) === null || _o5_x7 === void 0 ? void 0 : _o5_x7.y.z;
    (_o5_x8 = o5.x) === null || _o5_x8 === void 0 ? void 0 : (_o5_x_y_z4 = _o5_x8.y.z) === null || _o5_x_y_z4 === void 0 ? void 0 : _o5_x_y_z4.w;
    o5.x.y;
    o5.x.y.z.w;
}
o5.x;
(_o5_x1 = o5.x) === null || _o5_x1 === void 0 ? void 0 : _o5_x1.y;
(_o5_x2 = o5.x) === null || _o5_x2 === void 0 ? void 0 : _o5_x2.y.z;
(_o5_x3 = o5.x) === null || _o5_x3 === void 0 ? void 0 : (_o5_x_y_z1 = _o5_x3.y.z) === null || _o5_x_y_z1 === void 0 ? void 0 : _o5_x_y_z1.w;
o5.x.y;
o5.x.y.z.w;
if ((_o6 = o6) === null || _o6 === void 0 ? void 0 : _o6.f()) {
    o6; // Derived
    o6.f;
} else {
    var _o62;
    o6;
    (_o62 = o6) === null || _o62 === void 0 ? void 0 : _o62.f;
    o6.f;
}
o6;
(_o61 = o6) === null || _o61 === void 0 ? void 0 : _o61.f;
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
        case 'circle':
            return Math.PI * Math.pow(shape.radius, 2);
        case 'rectangle':
            return shape.width * shape.height;
        default:
            return 0;
    }
}
function extractCoordinates(f1) {
    var _f_geometry;
    if (((_f_geometry = f1.geometry) === null || _f_geometry === void 0 ? void 0 : _f_geometry.type) !== 'test') {
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
function f50(obj) {
    var _obj_main;
    for(var key in (_obj_main = obj.main) === null || _obj_main === void 0 ? void 0 : _obj_main.childs){
        if (obj.main.childs[key] === obj) {
            return obj;
        }
    }
    return null;
}

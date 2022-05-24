import _instanceof from "@swc/helpers/lib/_instanceof.js";
import _type_of from "@swc/helpers/lib/_type_of.js";
var ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8;
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
if ((ref = o4.x) === null || ref === void 0 ? void 0 : ref.y) {
    var ref9;
    o4.x; // { y: boolean }
    o4.x.y; // true
    (ref9 = o4.x) === null || ref9 === void 0 ? void 0 : ref9.y; // true
} else {
    var ref10;
    o4.x;
    (ref10 = o4.x) === null || ref10 === void 0 ? void 0 : ref10.y;
    o4.x.y;
}
o4.x;
(ref1 = o4.x) === null || ref1 === void 0 ? void 0 : ref1.y;
o4.x.y;
if ((ref3 = (ref2 = o5.x) === null || ref2 === void 0 ? void 0 : ref2.y.z) === null || ref3 === void 0 ? void 0 : ref3.w) {
    var ref11, ref12, ref13, ref14;
    o5.x;
    o5.x.y;
    o5.x.y.z;
    o5.x.y.z.w; // true
    (ref11 = o5.x.y.z) === null || ref11 === void 0 ? void 0 : ref11.w; // true
    (ref12 = o5.x) === null || ref12 === void 0 ? void 0 : ref12.y.z.w; // true
    (ref14 = (ref13 = o5.x) === null || ref13 === void 0 ? void 0 : ref13.y.z) === null || ref14 === void 0 ? void 0 : ref14.w; // true
} else {
    var ref15, ref16, ref17, ref18;
    o5.x;
    (ref15 = o5.x) === null || ref15 === void 0 ? void 0 : ref15.y;
    (ref16 = o5.x) === null || ref16 === void 0 ? void 0 : ref16.y.z;
    (ref18 = (ref17 = o5.x) === null || ref17 === void 0 ? void 0 : ref17.y.z) === null || ref18 === void 0 ? void 0 : ref18.w;
    o5.x.y;
    o5.x.y.z.w;
}
o5.x;
(ref4 = o5.x) === null || ref4 === void 0 ? void 0 : ref4.y;
(ref5 = o5.x) === null || ref5 === void 0 ? void 0 : ref5.y.z;
(ref7 = (ref6 = o5.x) === null || ref6 === void 0 ? void 0 : ref6.y.z) === null || ref7 === void 0 ? void 0 : ref7.w;
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
function f01(x) {
    if (!!true) {
        isString === null || isString === void 0 ? void 0 : isString(x);
        x;
    }
    if (!!true) {
        maybeIsString === null || maybeIsString === void 0 ? void 0 : maybeIsString(x);
        x;
    }
    if (!!true) {
        isDefined(maybeIsString);
        maybeIsString === null || maybeIsString === void 0 ? void 0 : maybeIsString(x);
        x;
    }
    if (!!true) {
        maybeNever === null || maybeNever === void 0 ? void 0 : maybeNever();
        x;
    }
}
function f10(o, value) {
    if ((o === null || o === void 0 ? void 0 : o.foo) === value) {
        o.foo;
    }
    if ((o === null || o === void 0 ? void 0 : o["foo"]) === value) {
        o["foo"];
    }
    if ((o === null || o === void 0 ? void 0 : o.bar()) === value) {
        o.bar;
    }
    if ((o === null || o === void 0 ? void 0 : o.foo) == value) {
        o.foo;
    }
    if ((o === null || o === void 0 ? void 0 : o["foo"]) == value) {
        o["foo"];
    }
    if ((o === null || o === void 0 ? void 0 : o.bar()) == value) {
        o.bar;
    }
}
function f11(o, value) {
    if ((o === null || o === void 0 ? void 0 : o.foo) === value) {
        o.foo;
    }
    if ((o === null || o === void 0 ? void 0 : o["foo"]) === value) {
        o["foo"];
    }
    if ((o === null || o === void 0 ? void 0 : o.bar()) === value) {
        o.bar;
    }
    if ((o === null || o === void 0 ? void 0 : o.foo) == value) {
        o.foo;
    }
    if ((o === null || o === void 0 ? void 0 : o["foo"]) == value) {
        o["foo"];
    }
    if ((o === null || o === void 0 ? void 0 : o.bar()) == value) {
        o.bar;
    }
}
function f12(o, value) {
    if ((o === null || o === void 0 ? void 0 : o.foo) === value) {
        o.foo; // Error
    }
    if ((o === null || o === void 0 ? void 0 : o["foo"]) === value) {
        o["foo"]; // Error
    }
    if ((o === null || o === void 0 ? void 0 : o.bar()) === value) {
        o.bar; // Error
    }
    if ((o === null || o === void 0 ? void 0 : o.foo) == value) {
        o.foo; // Error
    }
    if ((o === null || o === void 0 ? void 0 : o["foo"]) == value) {
        o["foo"]; // Error
    }
    if ((o === null || o === void 0 ? void 0 : o.bar()) == value) {
        o.bar; // Error
    }
}
function f12a(o, value) {
    if ((o === null || o === void 0 ? void 0 : o.foo) === value) {
        o.foo;
    }
    if ((o === null || o === void 0 ? void 0 : o["foo"]) === value) {
        o["foo"];
    }
    if ((o === null || o === void 0 ? void 0 : o.bar()) === value) {
        o.bar;
    }
    if ((o === null || o === void 0 ? void 0 : o.foo) == value) {
        o.foo; // Error
    }
    if ((o === null || o === void 0 ? void 0 : o["foo"]) == value) {
        o["foo"]; // Error
    }
    if ((o === null || o === void 0 ? void 0 : o.bar()) == value) {
        o.bar; // Error
    }
}
function f13(o) {
    if ((o === null || o === void 0 ? void 0 : o.foo) !== undefined) {
        o.foo;
    }
    if ((o === null || o === void 0 ? void 0 : o["foo"]) !== undefined) {
        o["foo"];
    }
    if ((o === null || o === void 0 ? void 0 : o.bar()) !== undefined) {
        o.bar;
    }
    if ((o === null || o === void 0 ? void 0 : o.foo) != undefined) {
        o.foo;
    }
    if ((o === null || o === void 0 ? void 0 : o["foo"]) != undefined) {
        o["foo"];
    }
    if ((o === null || o === void 0 ? void 0 : o.bar()) != undefined) {
        o.bar;
    }
}
function f13a(o) {
    if ((o === null || o === void 0 ? void 0 : o.foo) !== null) {
        o.foo; // Error
    }
    if ((o === null || o === void 0 ? void 0 : o["foo"]) !== null) {
        o["foo"]; // Error
    }
    if ((o === null || o === void 0 ? void 0 : o.bar()) !== null) {
        o.bar; // Error
    }
    if ((o === null || o === void 0 ? void 0 : o.foo) != null) {
        o.foo;
    }
    if ((o === null || o === void 0 ? void 0 : o["foo"]) != null) {
        o["foo"];
    }
    if ((o === null || o === void 0 ? void 0 : o.bar()) != null) {
        o.bar;
    }
}
function f14(o) {
    if ((o === null || o === void 0 ? void 0 : o.foo) !== undefined) {
        o.foo;
    }
    if ((o === null || o === void 0 ? void 0 : o["foo"]) !== undefined) {
        o["foo"];
    }
    if ((o === null || o === void 0 ? void 0 : o.bar()) !== undefined) {
        o.bar;
    }
}
function f15(o, value) {
    if ((o === null || o === void 0 ? void 0 : o.foo) === value) {
        o.foo;
    } else {
        o.foo; // Error
    }
    if ((o === null || o === void 0 ? void 0 : o.foo) !== value) {
        o.foo; // Error
    } else {
        o.foo;
    }
    if ((o === null || o === void 0 ? void 0 : o.foo) == value) {
        o.foo;
    } else {
        o.foo; // Error
    }
    if ((o === null || o === void 0 ? void 0 : o.foo) != value) {
        o.foo; // Error
    } else {
        o.foo;
    }
}
function f15a(o, value) {
    if ((o === null || o === void 0 ? void 0 : o.foo) === value) {
        o.foo; // Error
    } else {
        o.foo; // Error
    }
    if ((o === null || o === void 0 ? void 0 : o.foo) !== value) {
        o.foo; // Error
    } else {
        o.foo; // Error
    }
    if ((o === null || o === void 0 ? void 0 : o.foo) == value) {
        o.foo; // Error
    } else {
        o.foo; // Error
    }
    if ((o === null || o === void 0 ? void 0 : o.foo) != value) {
        o.foo; // Error
    } else {
        o.foo; // Error
    }
}
function f16(o) {
    if ((o === null || o === void 0 ? void 0 : o.foo) === undefined) {
        o.foo; // Error
    } else {
        o.foo;
    }
    if ((o === null || o === void 0 ? void 0 : o.foo) !== undefined) {
        o.foo;
    } else {
        o.foo; // Error
    }
    if ((o === null || o === void 0 ? void 0 : o.foo) == undefined) {
        o.foo; // Error
    } else {
        o.foo;
    }
    if ((o === null || o === void 0 ? void 0 : o.foo) != undefined) {
        o.foo;
    } else {
        o.foo; // Error
    }
}
function f20(o) {
    if (typeof (o === null || o === void 0 ? void 0 : o.foo) === "number") {
        o.foo;
    }
    if (typeof (o === null || o === void 0 ? void 0 : o["foo"]) === "number") {
        o["foo"];
    }
    if (typeof (o === null || o === void 0 ? void 0 : o.bar()) === "number") {
        o.bar;
    }
    if (_instanceof(o === null || o === void 0 ? void 0 : o.baz, Error)) {
        o.baz;
    }
}
function f21(o) {
    if (typeof (o === null || o === void 0 ? void 0 : o.foo) === "number") {
        o.foo;
    }
    if (typeof (o === null || o === void 0 ? void 0 : o["foo"]) === "number") {
        o["foo"];
    }
    if (typeof (o === null || o === void 0 ? void 0 : o.bar()) === "number") {
        o.bar;
    }
    if (_instanceof(o === null || o === void 0 ? void 0 : o.baz, Error)) {
        o.baz;
    }
}
function f22(o) {
    if (typeof (o === null || o === void 0 ? void 0 : o.foo) === "number") {
        o.foo;
    } else {
        o.foo; // Error
    }
    if (typeof (o === null || o === void 0 ? void 0 : o.foo) !== "number") {
        o.foo; // Error
    } else {
        o.foo;
    }
    if (typeof (o === null || o === void 0 ? void 0 : o.foo) == "number") {
        o.foo;
    } else {
        o.foo; // Error
    }
    if (typeof (o === null || o === void 0 ? void 0 : o.foo) != "number") {
        o.foo; // Error
    } else {
        o.foo;
    }
}
function f23(o) {
    if (typeof (o === null || o === void 0 ? void 0 : o.foo) === "undefined") {
        o.foo; // Error
    } else {
        o.foo;
    }
    if (typeof (o === null || o === void 0 ? void 0 : o.foo) !== "undefined") {
        o.foo;
    } else {
        o.foo; // Error
    }
    if (typeof (o === null || o === void 0 ? void 0 : o.foo) == "undefined") {
        o.foo; // Error
    } else {
        o.foo;
    }
    if (typeof (o === null || o === void 0 ? void 0 : o.foo) != "undefined") {
        o.foo;
    } else {
        o.foo; // Error
    }
}
function f30(o) {
    if (!!true) {
        assert(o === null || o === void 0 ? void 0 : o.foo);
        o.foo;
    }
    if (!!true) {
        assert((o === null || o === void 0 ? void 0 : o.foo) === 42);
        o.foo;
    }
    if (!!true) {
        assert(typeof (o === null || o === void 0 ? void 0 : o.foo) === "number");
        o.foo;
    }
    if (!!true) {
        assertNonNull(o === null || o === void 0 ? void 0 : o.foo);
        o.foo;
    }
}
function f40(o) {
    switch(o === null || o === void 0 ? void 0 : o.foo){
        case "abc":
            o.foo;
            break;
        case 42:
            o.foo;
            break;
        case undefined:
            o.foo; // Error
            break;
        default:
            o.foo; // Error
            break;
    }
}
function f41(o) {
    switch(_type_of(o === null || o === void 0 ? void 0 : o.foo)){
        case "string":
            o.foo;
            break;
        case "number":
            o.foo;
            break;
        case "undefined":
            o.foo; // Error
            break;
        default:
            o.foo; // Error
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
function extractCoordinates(f) {
    var ref20;
    if (((ref20 = f.geometry) === null || ref20 === void 0 ? void 0 : ref20.type) !== "test") {
        return [];
    }
    return f.geometry.coordinates;
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
while(((ref8 = arr[i]) === null || ref8 === void 0 ? void 0 : ref8.tag) === "left"){
    var ref19;
    i += 1;
    if (((ref19 = arr[i]) === null || ref19 === void 0 ? void 0 : ref19.tag) === "right") {
        console.log("I should ALSO be reachable");
    }
}

var ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8;
let a;
o === null || o === void 0 ? void 0 : o[a = 1];
a.toString();
let b;
o === null || o === void 0 ? void 0 : o.x[b = 1];
b.toString();
let c;
o === null || o === void 0 ? void 0 : o(c = 1);
c.toString();
let d;
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
    if ((o1 === null || o1 === void 0 ? void 0 : o1.baz) instanceof Error) {
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
    if ((o1 === null || o1 === void 0 ? void 0 : o1.baz) instanceof Error) {
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
    switch(typeof (o1 === null || o1 === void 0 ? void 0 : o1.foo)){
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
    var ref;
    if (((ref = f1.geometry) === null || ref === void 0 ? void 0 : ref.type) !== 'test') {
        return [];
    }
    return f1.geometry.coordinates;
}
let lastSomeProperty;
function someFunction(someOptionalObject) {
    if ((someOptionalObject === null || someOptionalObject === void 0 ? void 0 : someOptionalObject.someProperty) !== lastSomeProperty) {
        console.log(someOptionalObject);
        console.log(someOptionalObject.someProperty); // Error
        lastSomeProperty = someOptionalObject === null || someOptionalObject === void 0 ? void 0 : someOptionalObject.someProperty;
    }
}
const someObject = {
    someProperty: 42
};
someFunction(someObject);
someFunction(undefined);
// Repro from #35970
let i = 0;
while(((ref8 = arr[i]) === null || ref8 === void 0 ? void 0 : ref8.tag) === "left"){
    var ref19;
    i += 1;
    if (((ref19 = arr[i]) === null || ref19 === void 0 ? void 0 : ref19.tag) === "right") {
        console.log("I should ALSO be reachable");
    }
}

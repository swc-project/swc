import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// @strict: true
// @declaration: true
// Narrowing by aliased conditional expressions
function f10(x) {
    var isString = typeof x === "string";
    if (isString) {
        var t = x;
    } else {
        var t1 = x;
    }
}
function f11(x) {
    var isString = typeof x === "string";
    if (isString) {
        var t = x;
    }
}
function f12(x) {
    var isString = typeof x === "string";
    var isNumber = typeof x === "number";
    if (isString || isNumber) {
        var t = x;
    } else {
        var t2 = x;
    }
}
function f13(x) {
    var isString = typeof x === "string";
    var isNumber = typeof x === "number";
    var isStringOrNumber = isString || isNumber;
    if (isStringOrNumber) {
        var t = x;
    } else {
        var t3 = x;
    }
}
function f14(x) {
    var notUndefined = x !== undefined;
    return notUndefined ? x : 0;
}
function f15(obj1) {
    var isString = typeof obj1.x === "string";
    if (isString) {
        var s = obj1.x;
    }
}
function f16(obj2) {
    var isString = typeof obj2.x === "string";
    obj2 = {
        x: 42
    };
    if (isString) {
        var s = obj2.x; // Not narrowed because of is assigned in function body
    }
}
function f17(obj3) {
    var isString = typeof obj3[0] === "string";
    if (isString) {
        var s = obj3[0];
    }
}
function f18(obj4) {
    var isString = typeof obj4[0] === "string";
    obj4 = [
        42
    ];
    if (isString) {
        var s = obj4[0]; // Not narrowed because of is assigned in function body
    }
}
function f20(obj5) {
    var isFoo = obj5.kind === "foo";
    if (isFoo) {
        obj5.foo;
    } else {
        obj5.bar;
    }
}
function f21(obj6) {
    var isFoo = obj6.kind === "foo";
    if (isFoo) {
        obj6.foo; // Not narrowed because isFoo has type annotation
    } else {
        obj6.bar; // Not narrowed because isFoo has type annotation
    }
}
function f22(obj7) {
    var isFoo = obj7.kind === "foo";
    if (isFoo) {
        obj7.foo; // Not narrowed because isFoo is mutable
    } else {
        obj7.bar; // Not narrowed because isFoo is mutable
    }
}
function f23(obj8) {
    var isFoo = obj8.kind === "foo";
    obj8 = obj8;
    if (isFoo) {
        obj8.foo; // Not narrowed because obj is assigned in function body
    } else {
        obj8.bar; // Not narrowed because obj is assigned in function body
    }
}
function f24(arg) {
    var obj9 = arg;
    var isFoo = obj9.kind === "foo";
    if (isFoo) {
        obj9.foo;
    } else {
        obj9.bar;
    }
}
function f25(arg) {
    var obj10 = arg;
    var isFoo = obj10.kind === "foo";
    if (isFoo) {
        obj10.foo; // Not narrowed because obj is mutable
    } else {
        obj10.bar; // Not narrowed because obj is mutable
    }
}
function f26(outer) {
    var isFoo = outer.obj.kind === "foo";
    if (isFoo) {
        outer.obj.foo;
    } else {
        outer.obj.bar;
    }
}
function f27(outer) {
    var isFoo = outer.obj.kind === "foo";
    if (isFoo) {
        outer.obj.foo; // Not narrowed because obj is mutable
    } else {
        outer.obj.bar; // Not narrowed because obj is mutable
    }
}
function f28(obj11) {
    var isFoo = obj11 && obj11.kind === "foo";
    var isBar = obj11 && obj11.kind === "bar";
    if (isFoo) {
        obj11.foo;
    }
    if (isBar) {
        obj11.bar;
    }
}
// Narrowing by aliased discriminant property access
function f30(obj12) {
    var kind = obj12.kind;
    if (kind === "foo") {
        obj12.foo;
    } else {
        obj12.bar;
    }
}
function f31(obj13) {
    var kind = obj13.kind;
    if (kind === "foo") {
        obj13.foo;
    } else {
        obj13.bar;
    }
}
function f32(obj14) {
    var k = obj14.kind;
    if (k === "foo") {
        obj14.foo;
    } else {
        obj14.bar;
    }
}
function f33(obj15) {
    var kind = obj15.kind;
    switch(kind){
        case "foo":
            obj15.foo;
            break;
        case "bar":
            obj15.bar;
            break;
    }
}
var C10 = function C10(x) {
    "use strict";
    _class_call_check(this, C10);
    this.x = x;
    var thisX_isString = typeof this.x === "string";
    var xIsString = typeof x === "string";
    if (thisX_isString && xIsString) {
        var s;
        s = this.x;
        s = x;
    }
};
var C11 = function C11(x) {
    "use strict";
    _class_call_check(this, C11);
    this.x = x;
    var thisX_isString = typeof this.x === "string";
    var xIsString = typeof x === "string";
    if (thisX_isString && xIsString) {
        // Some narrowings may be invalidated due to later assignments.
        var s;
        s = this.x;
        s = x;
    } else {
        this.x = 10;
        x = 10;
    }
};
// Mixing of aliased discriminants and conditionals
function f40(obj16) {
    var kind = obj16.kind;
    var isFoo = kind == "foo";
    if (isFoo && obj16.foo) {
        var t = obj16.foo;
    }
}
function gg2(obj17) {
    if (obj17.kind === "str") {
        var t = obj17.payload;
    } else {
        var t4 = obj17.payload;
    }
}
function foo(param) {
    var kind = param.kind, payload = param.payload;
    if (kind === "str") {
        var t = payload;
    } else {
        var t5 = payload;
    }
}
// Repro from #45830
var obj = {
    fn: function() {
        return true;
    }
};
if (a) {}
var a = obj.fn();

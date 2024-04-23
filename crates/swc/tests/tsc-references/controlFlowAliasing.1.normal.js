//// [controlFlowAliasing.ts]
// Narrowing by aliased conditional expressions
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
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
        var t1 = x;
    }
}
function f13(x) {
    var isString = typeof x === "string";
    var isNumber = typeof x === "number";
    var isStringOrNumber = isString || isNumber;
    if (isStringOrNumber) {
        var t = x;
    } else {
        var t1 = x;
    }
}
function f14(x) {
    var notUndefined = x !== undefined;
    return notUndefined ? x : 0;
}
function f15(obj) {
    var isString = typeof obj.x === 'string';
    if (isString) {
        var s = obj.x;
    }
}
function f16(obj) {
    var isString = typeof obj.x === 'string';
    obj = {
        x: 42
    };
    if (isString) {
        var s = obj.x; // Not narrowed because of is assigned in function body
    }
}
function f17(obj) {
    var isString = typeof obj[0] === 'string';
    if (isString) {
        var s = obj[0];
    }
}
function f18(obj) {
    var isString = typeof obj[0] === 'string';
    obj = [
        42
    ];
    if (isString) {
        var s = obj[0]; // Not narrowed because of is assigned in function body
    }
}
function f20(obj) {
    var isFoo = obj.kind === 'foo';
    if (isFoo) {
        obj.foo;
    } else {
        obj.bar;
    }
}
function f21(obj) {
    var isFoo = obj.kind === 'foo';
    if (isFoo) {
        obj.foo; // Not narrowed because isFoo has type annotation
    } else {
        obj.bar; // Not narrowed because isFoo has type annotation
    }
}
function f22(obj) {
    var isFoo = obj.kind === 'foo';
    if (isFoo) {
        obj.foo; // Not narrowed because isFoo is mutable
    } else {
        obj.bar; // Not narrowed because isFoo is mutable
    }
}
function f23(obj) {
    var isFoo = obj.kind === 'foo';
    obj = obj;
    if (isFoo) {
        obj.foo; // Not narrowed because obj is assigned in function body
    } else {
        obj.bar; // Not narrowed because obj is assigned in function body
    }
}
function f24(arg) {
    var obj = arg;
    var isFoo = obj.kind === 'foo';
    if (isFoo) {
        obj.foo;
    } else {
        obj.bar;
    }
}
function f25(arg) {
    var obj = arg;
    var isFoo = obj.kind === 'foo';
    if (isFoo) {
        obj.foo;
    } else {
        obj.bar;
    }
}
function f26(outer) {
    var isFoo = outer.obj.kind === 'foo';
    if (isFoo) {
        outer.obj.foo;
    } else {
        outer.obj.bar;
    }
}
function f27(outer) {
    var isFoo = outer.obj.kind === 'foo';
    if (isFoo) {
        outer.obj.foo; // Not narrowed because obj is mutable
    } else {
        outer.obj.bar; // Not narrowed because obj is mutable
    }
}
function f28(obj) {
    var isFoo = obj && obj.kind === 'foo';
    var isBar = obj && obj.kind === 'bar';
    if (isFoo) {
        obj.foo;
    }
    if (isBar) {
        obj.bar;
    }
}
// Narrowing by aliased discriminant property access
function f30(obj) {
    var kind = obj.kind;
    if (kind === 'foo') {
        obj.foo;
    } else {
        obj.bar;
    }
}
function f31(obj) {
    var kind = obj.kind;
    if (kind === 'foo') {
        obj.foo;
    } else {
        obj.bar;
    }
}
function f32(obj) {
    var k = obj.kind;
    if (k === 'foo') {
        obj.foo;
    } else {
        obj.bar;
    }
}
function f33(obj) {
    var kind = obj.kind;
    switch(kind){
        case 'foo':
            obj.foo;
            break;
        case 'bar':
            obj.bar;
            break;
    }
}
var C10 = function C10(x) {
    "use strict";
    _class_call_check(this, C10);
    this.x = x;
    var thisX_isString = typeof this.x === 'string';
    var xIsString = typeof x === 'string';
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
    var thisX_isString = typeof this.x === 'string';
    var xIsString = typeof x === 'string';
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
function f40(obj) {
    var kind = obj.kind;
    var isFoo = kind == 'foo';
    if (isFoo && obj.foo) {
        var t = obj.foo;
    }
}
function gg2(obj) {
    if (obj.kind === 'str') {
        var t = obj.payload;
    } else {
        var t1 = obj.payload;
    }
}
function foo(param) {
    var kind = param.kind, payload = param.payload;
    if (kind === 'str') {
        var t = payload;
    } else {
        var t1 = payload;
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
// repro from https://github.com/microsoft/TypeScript/issues/53267
var Utils = /*#__PURE__*/ function() {
    "use strict";
    function Utils() {
        _class_call_check(this, Utils);
    }
    Utils.isDefined = function isDefined(value) {
        return value != null;
    };
    return Utils;
}();
var A53267 = /*#__PURE__*/ function() {
    "use strict";
    function A53267() {
        _class_call_check(this, A53267);
    }
    var _proto = A53267.prototype;
    _proto.foo = function foo() {
        var isNumber = Utils.isDefined(this.testNumber);
        if (isNumber) {
            var x = this.testNumber;
        }
    };
    return A53267;
}();

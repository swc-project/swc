//// [neverReturningFunctions1.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
function fail(message) {
    throw new Error(message);
}
function f01(x) {
    if (x === undefined) fail("undefined argument");
    x.length; // string
}
function f02(x) {
    if (x >= 0) return x;
    fail("negative number");
    x; // Unreachable
}
function f03(x) {
    x; // string
    fail();
    x; // Unreachable
}
function f11(x, fail) {
    if (x === undefined) fail("undefined argument");
    x.length; // string
}
function f12(x, fail) {
    if (x >= 0) return x;
    fail("negative number");
    x; // Unreachable
}
function f13(x, fail) {
    x; // string
    fail();
    x; // Unreachable
}
function f21(x) {
    if (x === undefined) Debug.fail("undefined argument");
    x.length; // string
}
function f22(x) {
    if (x >= 0) return x;
    Debug.fail("negative number");
    x; // Unreachable
}
function f23(x) {
    x; // string
    Debug.fail();
    x; // Unreachable
}
function f24(x) {
    x; // string
    Debug.fail();
    x; // Unreachable
}
var Test = /*#__PURE__*/ function() {
    "use strict";
    function Test() {
        _class_call_check(this, Test);
    }
    var _proto = Test.prototype;
    _proto.fail = function fail(message) {
        throw new Error(message);
    };
    _proto.f1 = function f1(x) {
        if (x === undefined) this.fail("undefined argument");
        x.length; // string
    };
    _proto.f2 = function f2(x) {
        if (x >= 0) return x;
        this.fail("negative number");
        x; // Unreachable
    };
    _proto.f3 = function f3(x) {
        x; // string
        this.fail();
        x; // Unreachable
    };
    return Test;
}();
function f30(x) {
    if (typeof x === "string") {
        fail();
        x; // Unreachable
    } else {
        x; // number | undefined
        if (x !== undefined) {
            x; // number
            fail();
            x; // Unreachable
        } else {
            x; // undefined
            fail();
            x; // Unreachable
        }
        x; // Unreachable
    }
    x; // Unreachable
}
function f31(x) {
    if (typeof x.a === "string") {
        fail();
        x; // Unreachable
        x.a; // Unreachable
    }
    x; // { a: string | number }
    x.a; // number
}
function f40(x) {
    try {
        x;
        fail();
        x; // Unreachable
    } finally{
        x;
        fail();
        x; // Unreachable
    }
    x; // Unreachable
}
function f41(x) {
    try {
        x;
    } finally{
        x;
        fail();
        x; // Unreachable
    }
    x; // Unreachable
}
function f42(x) {
    try {
        x;
        fail();
        x; // Unreachable
    } finally{
        x;
    }
    x; // Unreachable
}
function f43() {
    var fail = function() {
        throw new Error();
    };
    var f = [
        fail
    ];
    fail(); // No effect (missing type annotation)
    f[0](); // No effect (not a dotted name)
    f;
}
var Component = registerComponent('test-component', {
    schema: {
        myProperty: {
            default: [],
            parse: function parse() {
                return [
                    true
                ];
            }
        },
        string: {
            type: 'string'
        },
        num: 0
    },
    init: function init() {
        this.data.num = 0;
        this.el.setAttribute('custom-attribute', 'custom-value');
    },
    update: function update() {},
    tick: function tick() {},
    remove: function remove() {},
    pause: function pause() {},
    play: function play() {},
    multiply: function multiply(f) {
        // Reference to system because both were registered with the same name.
        return f * this.data.num * this.system.data.counter;
    }
});
// Repro from #36147
var MyThrowable = /*#__PURE__*/ function() {
    "use strict";
    function MyThrowable() {
        _class_call_check(this, MyThrowable);
    }
    var _proto = MyThrowable.prototype;
    _proto.throw = function _throw() {
        throw new Error();
    };
    return MyThrowable;
}();
var SuperThrowable = /*#__PURE__*/ function(MyThrowable) {
    "use strict";
    _inherits(SuperThrowable, MyThrowable);
    function SuperThrowable() {
        _class_call_check(this, SuperThrowable);
        return _call_super(this, SuperThrowable, arguments);
    }
    var _proto = SuperThrowable.prototype;
    _proto.err = function err(msg) {
        _get(_get_prototype_of(SuperThrowable.prototype), "throw", this).call(this);
    };
    _proto.ok = function ok() {
        this.throw();
    };
    return SuperThrowable;
}(MyThrowable);
function foo(services, s) {
    if (s === null) {
        services.panic("ouch");
    } else {
        return s;
    }
}
export { };

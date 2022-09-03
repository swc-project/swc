//// [neverReturningFunctions1.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
function fail(message) {
    throw Error(message);
}
function f01(x) {
    void 0 === x && fail("undefined argument"), x.length;
}
function f02(x) {
    if (x >= 0) return x;
    fail("negative number");
}
function f03(x) {
    fail();
}
function f11(x, fail) {
    void 0 === x && fail("undefined argument"), x.length;
}
function f12(x, fail) {
    if (x >= 0) return x;
    fail("negative number");
}
function f13(x, fail) {
    fail();
}
function f21(x) {
    void 0 === x && Debug.fail("undefined argument"), x.length;
}
function f22(x) {
    if (x >= 0) return x;
    Debug.fail("negative number");
}
function f23(x) {
    Debug.fail();
}
function f24(x) {
    Debug.fail();
}
var Test = function() {
    "use strict";
    function Test() {
        _class_call_check(this, Test);
    }
    var _proto = Test.prototype;
    return _proto.fail = function(message) {
        throw Error(message);
    }, _proto.f1 = function(x) {
        void 0 === x && this.fail("undefined argument"), x.length;
    }, _proto.f2 = function(x) {
        if (x >= 0) return x;
        this.fail("negative number");
    }, _proto.f3 = function(x) {
        this.fail();
    }, Test;
}();
function f30(x) {
    fail();
}
function f31(x) {
    "string" == typeof x.a && (fail(), x.a), x.a;
}
function f40(x) {
    try {
        fail();
    } finally{
        fail();
    }
}
function f41(x) {
    fail();
}
function f42(x) {
    fail();
}
function f43() {
    var fail = function() {
        throw Error();
    };
    fail(), [
        fail
    ][0]();
}
var Component = registerComponent("test-component", {
    schema: {
        myProperty: {
            default: [],
            parse: function() {
                return [
                    !0
                ];
            }
        },
        string: {
            type: "string"
        },
        num: 0
    },
    init: function() {
        this.data.num = 0, this.el.setAttribute("custom-attribute", "custom-value");
    },
    update: function() {},
    tick: function() {},
    remove: function() {},
    pause: function() {},
    play: function() {},
    multiply: function(f) {
        return f * this.data.num * this.system.data.counter;
    }
}), MyThrowable = function() {
    "use strict";
    function MyThrowable() {
        _class_call_check(this, MyThrowable);
    }
    return MyThrowable.prototype.throw = function() {
        throw Error();
    }, MyThrowable;
}(), SuperThrowable = function(MyThrowable) {
    "use strict";
    _inherits(SuperThrowable, MyThrowable);
    var _super = _create_super(SuperThrowable);
    function SuperThrowable() {
        return _class_call_check(this, SuperThrowable), _super.apply(this, arguments);
    }
    var _proto = SuperThrowable.prototype;
    return _proto.err = function(msg) {
        _get(_get_prototype_of(SuperThrowable.prototype), "throw", this).call(this);
    }, _proto.ok = function() {
        this.throw();
    }, SuperThrowable;
}(MyThrowable);
function foo(services, s) {
    if (null !== s) return s;
    services.panic("ouch");
}

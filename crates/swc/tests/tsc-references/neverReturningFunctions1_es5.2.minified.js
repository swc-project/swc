import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _get from "@swc/helpers/lib/_get.js";
import _get_prototype_of from "@swc/helpers/lib/_get_prototype_of.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
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
registerComponent("test-component", {
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
});
var MyThrowable = function() {
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

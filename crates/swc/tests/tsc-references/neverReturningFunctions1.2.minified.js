//// [neverReturningFunctions1.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function() {
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
}(), registerComponent("test-component", {
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

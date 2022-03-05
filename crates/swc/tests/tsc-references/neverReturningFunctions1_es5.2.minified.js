import * as swcHelpers from "@swc/helpers";
var Test = function() {
    "use strict";
    function Test() {
        swcHelpers.classCallCheck(this, Test);
    }
    return swcHelpers.createClass(Test, [
        {
            key: "fail",
            value: function(message) {
                throw new Error(message);
            }
        },
        {
            key: "f1",
            value: function(x) {
                void 0 === x && this.fail("undefined argument"), x.length;
            }
        },
        {
            key: "f2",
            value: function(x) {
                if (x >= 0) return x;
                this.fail("negative number");
            }
        },
        {
            key: "f3",
            value: function(x) {
                this.fail();
            }
        }
    ]), Test;
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
        swcHelpers.classCallCheck(this, MyThrowable);
    }
    return swcHelpers.createClass(MyThrowable, [
        {
            key: "throw",
            value: function() {
                throw new Error();
            }
        }
    ]), MyThrowable;
}(), SuperThrowable = function(MyThrowable) {
    "use strict";
    swcHelpers.inherits(SuperThrowable, MyThrowable);
    var _super = swcHelpers.createSuper(SuperThrowable);
    function SuperThrowable() {
        return swcHelpers.classCallCheck(this, SuperThrowable), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(SuperThrowable, [
        {
            key: "err",
            value: function(msg) {
                swcHelpers.get(swcHelpers.getPrototypeOf(SuperThrowable.prototype), "throw", this).call(this);
            }
        },
        {
            key: "ok",
            value: function() {
                this.throw();
            }
        }
    ]), SuperThrowable;
}(MyThrowable);

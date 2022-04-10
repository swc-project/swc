import * as swcHelpers from "@swc/helpers";
var Test = function() {
    function Test() {
        swcHelpers.classCallCheck(this, Test);
    }
    var _proto = Test.prototype;
    return _proto.fail = function(message) {
        throw new Error(message);
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
    function MyThrowable() {
        swcHelpers.classCallCheck(this, MyThrowable);
    }
    return MyThrowable.prototype.throw = function() {
        throw new Error();
    }, MyThrowable;
}(), SuperThrowable = function(MyThrowable) {
    swcHelpers.inherits(SuperThrowable, MyThrowable);
    var _super = swcHelpers.createSuper(SuperThrowable);
    function SuperThrowable() {
        return swcHelpers.classCallCheck(this, SuperThrowable), _super.apply(this, arguments);
    }
    var _proto = SuperThrowable.prototype;
    return _proto.err = function(msg) {
        swcHelpers.get(swcHelpers.getPrototypeOf(SuperThrowable.prototype), "throw", this).call(this);
    }, _proto.ok = function() {
        this.throw();
    }, SuperThrowable;
}(MyThrowable);

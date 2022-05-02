import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
var A = function() {
    "use strict";
    swcHelpers.classCallCheck(this, A), swcHelpers.classStaticPrivateMethodGet(A, A, foo).call(A, 30), swcHelpers.classStaticPrivateMethodGet(A, A, bar).call(A, 30), swcHelpers.classStaticPrivateMethodGet(A, A, bar).call(A, 30), swcHelpers.classStaticPrivateFieldSpecSet(A, A, _quux, swcHelpers.classStaticPrivateFieldSpecGet(A, A, _quux) + 1), swcHelpers.classStaticPrivateFieldUpdate(A, A, _quux).value++;
}, _quux = {
    get: function() {
        return swcHelpers.classStaticPrivateFieldSpecGet(this, A, __quux);
    },
    set: function(val) {
        swcHelpers.classStaticPrivateFieldSpecSet(this, A, __quux, val);
    }
}, __quux = {
    writable: !0,
    value: void 0
};
function foo(a) {}
function bar(a) {
    return _bar.apply(this, arguments);
}
function _bar() {
    return (_bar = swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee(a) {
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
var B = function(A1) {
    "use strict";
    swcHelpers.inherits(B, A1);
    var _super = swcHelpers.createSuper(B);
    function B() {
        swcHelpers.classCallCheck(this, B);
        var _this = _super.call(this);
        return swcHelpers.classStaticPrivateMethodGet(B, B, foo1).call(B, "str"), _this;
    }
    return B;
}(A);
function foo1(a) {}

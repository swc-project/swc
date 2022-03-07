import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
var Base = // @strict: true
// @target: ES6
/*#__PURE__*/ function() {
    "use strict";
    function Base() {
        swcHelpers.classCallCheck(this, Base);
    }
    var _proto = Base.prototype;
    _proto.method = function method() {};
    return Base;
}();
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Derived, Base);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        swcHelpers.classCallCheck(this, Derived);
        return _super.apply(this, arguments);
    }
    var _proto = Derived.prototype;
    _proto.method = function method() {
        var ref;
        return (ref = swcHelpers.get(swcHelpers.getPrototypeOf(Derived.prototype), "method", this)) === null || ref === void 0 ? void 0 : ref.call(this);
    };
    _proto.asyncMethod = function asyncMethod() {
        var _this = this;
        var _this1 = this, _superprop_get_method = function() {
            return swcHelpers.get(swcHelpers.getPrototypeOf(Derived.prototype), "method", _this);
        };
        return swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            var ref;
            return regeneratorRuntime.wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        ;
                        return _ctx.abrupt("return", (ref = _superprop_get_method()) === null || ref === void 0 ? void 0 : ref.call(_this1));
                    case 2:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    };
    return Derived;
}(Base);

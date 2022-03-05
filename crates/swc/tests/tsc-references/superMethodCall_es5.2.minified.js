import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
var Base = function() {
    "use strict";
    function Base() {
        swcHelpers.classCallCheck(this, Base);
    }
    return swcHelpers.createClass(Base, [
        {
            key: "method",
            value: function() {}
        }
    ]), Base;
}(), Derived = function(Base) {
    "use strict";
    swcHelpers.inherits(Derived, Base);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        return swcHelpers.classCallCheck(this, Derived), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(Derived, [
        {
            key: "method",
            value: function() {
                var ref;
                return null === (ref = swcHelpers.get(swcHelpers.getPrototypeOf(Derived.prototype), "method", this)) || void 0 === ref ? void 0 : ref.call(this);
            }
        },
        {
            key: "asyncMethod",
            value: function() {
                var _this = this, _this1 = this;
                return swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                    var ref;
                    return regeneratorRuntime.wrap(function(_ctx) {
                        for(;;)switch(_ctx.prev = _ctx.next){
                            case 0:
                                return _ctx.abrupt("return", null === (ref = swcHelpers.get(swcHelpers.getPrototypeOf(Derived.prototype), "method", _this)) || void 0 === ref ? void 0 : ref.call(_this1));
                            case 2:
                            case "end":
                                return _ctx.stop();
                        }
                    }, _callee);
                }))();
            }
        }
    ]), Derived;
}(Base);

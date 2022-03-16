import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
export var Base = function() {
    "use strict";
    function Base() {
        swcHelpers.classCallCheck(this, Base);
    }
    return Base.prototype.toJSON = function() {
        return {
            type: void 0,
            name: void 0,
            inheritance: void 0
        };
    }, Base;
}();
export var Argument = function(Base) {
    "use strict";
    swcHelpers.inherits(Argument, Base);
    var _super = swcHelpers.createSuper(Argument);
    function Argument() {
        return swcHelpers.classCallCheck(this, Argument), _super.apply(this, arguments);
    }
    return Argument.prototype.validate = regeneratorRuntime.mark(function validate(defs) {
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                case "end":
                    return _ctx.stop();
            }
        }, validate);
    }), Argument.parse = function(tokeniser) {}, swcHelpers.createClass(Argument, [
        {
            key: "type",
            get: function() {
                return "argument";
            }
        }
    ]), Argument;
}(Base);

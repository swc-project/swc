import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
export var Base = function() {
    "use strict";
    function Base() {
        swcHelpers.classCallCheck(this, Base);
    }
    return swcHelpers.createClass(Base, [
        {
            key: "toJSON",
            value: function() {
                return {
                    type: void 0,
                    name: void 0,
                    inheritance: void 0
                };
            }
        }
    ]), Base;
}();
export var Argument = function(Base) {
    "use strict";
    swcHelpers.inherits(Argument, Base);
    var _super = swcHelpers.createSuper(Argument);
    function Argument() {
        return swcHelpers.classCallCheck(this, Argument), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(Argument, [
        {
            key: "type",
            get: function() {
                return "argument";
            }
        },
        {
            key: "validate",
            value: regeneratorRuntime.mark(function validate(defs) {
                return regeneratorRuntime.wrap(function(_ctx) {
                    for(;;)switch(_ctx.prev = _ctx.next){
                        case 0:
                        case "end":
                            return _ctx.stop();
                    }
                }, validate);
            })
        }
    ], [
        {
            key: "parse",
            value: function(tokeniser) {}
        }
    ]), Argument;
}(Base);

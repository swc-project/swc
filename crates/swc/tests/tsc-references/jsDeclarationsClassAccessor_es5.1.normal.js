import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
// @filename: base.js
export var Base = /*#__PURE__*/ function() {
    "use strict";
    function Base() {
        swcHelpers.classCallCheck(this, Base);
    }
    var _proto = Base.prototype;
    _proto.toJSON = function toJSON() {
        var json = {
            type: undefined,
            name: undefined,
            inheritance: undefined
        };
        return json;
    };
    return Base;
}();
export var Argument = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Argument, Base);
    var _super = swcHelpers.createSuper(Argument);
    function Argument() {
        swcHelpers.classCallCheck(this, Argument);
        return _super.apply(this, arguments);
    }
    var _proto = Argument.prototype;
    /**
     * @param {*} defs
     */ _proto.validate = regeneratorRuntime.mark(function validate(defs) {
        return regeneratorRuntime.wrap(function validate$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                case "end":
                    return _ctx.stop();
            }
        }, validate);
    });
    /**
     * @param {*} tokeniser
     */ Argument.parse = function parse(tokeniser) {
        return;
    };
    swcHelpers.createClass(Argument, [
        {
            key: "type",
            get: function get() {
                return "argument";
            }
        }
    ]);
    return Argument;
}(Base);

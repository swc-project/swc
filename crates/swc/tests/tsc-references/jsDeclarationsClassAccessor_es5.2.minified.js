import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import regeneratorRuntime from "regenerator-runtime";
export var Base = function() {
    "use strict";
    function Base() {
        _class_call_check(this, Base);
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
    _inherits(Argument, Base);
    var _super = _create_super(Argument);
    function Argument() {
        return _class_call_check(this, Argument), _super.apply(this, arguments);
    }
    return Argument.prototype.validate = regeneratorRuntime.mark(function validate(defs) {
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                case "end":
                    return _ctx.stop();
            }
        }, validate);
    }), Argument.parse = function(tokeniser) {}, _create_class(Argument, [
        {
            key: "type",
            get: function() {
                return "argument";
            }
        }
    ]), Argument;
}(Base);

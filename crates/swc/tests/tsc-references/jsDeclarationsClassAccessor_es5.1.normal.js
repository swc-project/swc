import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import regeneratorRuntime from "regenerator-runtime";
// @filename: base.js
export var Base = /*#__PURE__*/ function() {
    "use strict";
    function Base() {
        _class_call_check(this, Base);
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
    _inherits(Argument, Base);
    var _super = _create_super(Argument);
    function Argument() {
        _class_call_check(this, Argument);
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
    _create_class(Argument, [
        {
            key: "type",
            get: function get() {
                return "argument";
            }
        }
    ]);
    return Argument;
}(Base);

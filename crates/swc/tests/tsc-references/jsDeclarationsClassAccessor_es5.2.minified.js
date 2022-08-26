export { };
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
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
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
import { Base } from "./base.js";
export var Argument = function(Base) {
    "use strict";
    _inherits(Argument, Base);
    var _super = _create_super(Argument);
    function Argument() {
        return _class_call_check(this, Argument), _super.apply(this, arguments);
    }
    var _proto = Argument.prototype;
    return _proto.validate = function(defs) {
        return _ts_generator(this, function(_state) {
            return [
                2
            ];
        });
    }, Argument.parse = function(tokeniser) {}, _create_class(Argument, [
        {
            key: "type",
            get: function() {
                return "argument";
            }
        }
    ]), Argument;
}(Base);

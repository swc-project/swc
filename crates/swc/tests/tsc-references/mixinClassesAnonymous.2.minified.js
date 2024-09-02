//// [mixinClassesAnonymous.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
var _class, Derived = /*#__PURE__*/ function(Base) {
    function Derived(x, y, z) {
        var _this;
        return _class_call_check(this, Derived), (_this = _call_super(this, Derived, [
            x,
            y
        ])).z = z, _this;
    }
    return _inherits(Derived, Base), Derived;
}(function Base(x, y) {
    _class_call_check(this, Base), this.x = x, this.y = y;
});
function Tagged(superClass) {
    return /*#__PURE__*/ function(superClass) {
        function C() {
            for(var _this, _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
            return _class_call_check(this, C), (_this = _call_super(this, C, _to_consumable_array(args)))._tag = "hello", _this;
        }
        return _inherits(C, superClass), C;
    }(superClass);
}
Tagged(Derived), Tagged(((_class = /*#__PURE__*/ function(superClass) {
    function _class() {
        return _class_call_check(this, _class), _call_super(this, _class, arguments);
    }
    return _inherits(_class, superClass), _class.prototype.print = function() {
        this.x, this.y;
    }, _class;
}(Derived)).message = "hello", _class)).message;

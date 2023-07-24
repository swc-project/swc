//// [mixinClassesAnnotated.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var _class, Derived = function(Base) {
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived(x, y, z) {
        var _this;
        return _class_call_check(this, Derived), (_this = _super.call(this, x, y)).z = z, _this;
    }
    return Derived;
}(function Base(x, y) {
    _class_call_check(this, Base), this.x = x, this.y = y;
});
function Tagged(superClass) {
    return function(superClass) {
        _inherits(C, superClass);
        var _super = _create_super(C);
        function C() {
            for(var _this, _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
            return _class_call_check(this, C), (_this = _super.call.apply(_super, [
                this
            ].concat(_to_consumable_array(args))))._tag = "hello", _this;
        }
        return C;
    }(superClass);
}
Tagged(Derived), Tagged(((_class = function(superClass) {
    _inherits(_class, superClass);
    var _super = _create_super(_class);
    function _class() {
        return _class_call_check(this, _class), _super.apply(this, arguments);
    }
    return _class.prototype.print = function() {
        this.x, this.y;
    }, _class;
}(Derived)).message = "hello", _class)).message;

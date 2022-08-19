import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var _class, Base = function Base(x, y) {
    "use strict";
    _class_call_check(this, Base), this.x = x, this.y = y;
}, Derived = function(Base) {
    "use strict";
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived(x, y, z) {
        var _this;
        return _class_call_check(this, Derived), (_this = _super.call(this, x, y)).z = z, _this;
    }
    return Derived;
}(Base);
function Tagged(superClass) {
    return function(superClass) {
        "use strict";
        _inherits(C, superClass);
        var _super = _create_super(C);
        function C() {
            for(var _this, _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
            return _class_call_check(this, C), _this = _super.call.apply(_super, [
                this
            ].concat(_to_consumable_array(args))), _this._tag = "hello", _this;
        }
        return C;
    }(superClass);
}
Tagged(Derived);
var Thing2 = Tagged(((_class = function(superClass) {
    "use strict";
    _inherits(_class, superClass);
    var _super = _create_super(_class);
    function _class() {
        return _class_call_check(this, _class), _super.apply(this, arguments);
    }
    var _proto = _class.prototype;
    return _proto.print = function() {
        this.x, this.y;
    }, _class;
}(Derived)).message = "hello", _class));
Thing2.message;

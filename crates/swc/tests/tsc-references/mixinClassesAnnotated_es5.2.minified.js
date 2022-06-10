import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _to_consumable_array from "@swc/helpers/lib/_to_consumable_array.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var _class, Base = function(x, y) {
    "use strict";
    _class_call_check(this, Base), this.x = x, this.y = y;
}, Derived = function(Base1) {
    "use strict";
    _inherits(Derived, Base1);
    var _super = _create_super(Derived);
    function Derived(x, y, z) {
        var _this;
        return _class_call_check(this, Derived), (_this = _super.call(this, x, y)).z = z, _this;
    }
    return Derived;
}(Base);
function Tagged(superClass1) {
    var C = function(superClass) {
        "use strict";
        _inherits(C, superClass);
        var _super = _create_super(C);
        function C() {
            for(var _this, _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
            return _class_call_check(this, C), (_this = _super.call.apply(_super, [
                this
            ].concat(_to_consumable_array(args))))._tag = "hello", _this;
        }
        return C;
    }(superClass1);
    return C;
}
Tagged(Derived);
var Thing2 = Tagged(((_class = function(superClass) {
    "use strict";
    _inherits(_class, superClass);
    var _super = _create_super(_class);
    function _class() {
        return _class_call_check(this, _class), _super.apply(this, arguments);
    }
    return _class.prototype.print = function() {
        this.x, this.y;
    }, _class;
}(Derived)).message = "hello", _class));
Thing2.message;
var Thing3 = function(Thing21) {
    "use strict";
    _inherits(Thing3, Thing21);
    var _super = _create_super(Thing3);
    function Thing3(tag) {
        var _this;
        return _class_call_check(this, Thing3), (_this = _super.call(this, 10, 20, 30))._tag = tag, _this;
    }
    return Thing3.prototype.test = function() {
        this.print();
    }, Thing3;
}(Thing2);

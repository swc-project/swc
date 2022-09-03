//// [mixinClassesAnonymous.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var Base = function Base(x, y) {
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
}(Base), Printable = function(superClass) {
    var _class = function(superClass) {
        "use strict";
        _inherits(_class, superClass);
        var _super = _create_super(_class);
        function _class() {
            return _class_call_check(this, _class), _super.apply(this, arguments);
        }
        return _class.prototype.print = function() {
            this.x, this.y;
        }, _class;
    }(superClass);
    return _class.message = "hello", _class;
};
function Tagged(superClass) {
    return function(superClass) {
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
    }(superClass);
}
var Thing1 = Tagged(Derived), Thing2 = Tagged(Printable(Derived));
function f1() {
    var thing = new Thing1(1, 2, 3);
    thing.x, thing._tag;
}
function f2() {
    var thing = new Thing2(1, 2, 3);
    thing.x, thing._tag, thing.print();
}
Thing2.message;
var Thing3 = function(Thing2) {
    "use strict";
    _inherits(Thing3, Thing2);
    var _super = _create_super(Thing3);
    function Thing3(tag) {
        var _this;
        return _class_call_check(this, Thing3), (_this = _super.call(this, 10, 20, 30))._tag = tag, _this;
    }
    return Thing3.prototype.test = function() {
        this.print();
    }, Thing3;
}(Thing2), Timestamped = function(Base) {
    return function(Base) {
        "use strict";
        _inherits(_class, Base);
        var _super = _create_super(_class);
        function _class() {
            var _this;
            return _class_call_check(this, _class), _this = _super.apply(this, arguments), _this.timestamp = new Date(), _this;
        }
        return _class;
    }(Base);
};

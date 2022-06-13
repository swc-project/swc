import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var Base = function Base(x, y) {
    "use strict";
    _class_call_check(this, Base);
    this.x = x;
    this.y = y;
};
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived(x, y, z) {
        _class_call_check(this, Derived);
        var _this;
        _this = _super.call(this, x, y);
        _this.z = z;
        return _this;
    }
    return Derived;
}(Base);
var Printable = function(superClass1) {
    var _class = /*#__PURE__*/ function(superClass) {
        "use strict";
        _inherits(_class, superClass);
        var _super = _create_super(_class);
        function _class() {
            _class_call_check(this, _class);
            return _super.apply(this, arguments);
        }
        var _proto = _class.prototype;
        _proto.print = function print() {
            var output = this.x + "," + this.y;
        };
        return _class;
    }(superClass1);
    _class.message = "hello";
    return _class;
};
function Tagged(superClass2) {
    var C = /*#__PURE__*/ function(superClass) {
        "use strict";
        _inherits(C, superClass);
        var _super = _create_super(C);
        function C() {
            for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                args[_key] = arguments[_key];
            }
            _class_call_check(this, C);
            var _this;
            _this = _super.call.apply(_super, [
                this
            ].concat(_to_consumable_array(args)));
            _this._tag = "hello";
            return _this;
        }
        return C;
    }(superClass2);
    return C;
}
var Thing1 = Tagged(Derived);
var Thing2 = Tagged(Printable(Derived));
Thing2.message;
function f1() {
    var thing = new Thing1(1, 2, 3);
    thing.x;
    thing._tag;
}
function f2() {
    var thing = new Thing2(1, 2, 3);
    thing.x;
    thing._tag;
    thing.print();
}
var Thing3 = /*#__PURE__*/ function(Thing21) {
    "use strict";
    _inherits(Thing3, Thing21);
    var _super = _create_super(Thing3);
    function Thing3(tag) {
        _class_call_check(this, Thing3);
        var _this;
        _this = _super.call(this, 10, 20, 30);
        _this._tag = tag;
        return _this;
    }
    var _proto = Thing3.prototype;
    _proto.test = function test() {
        this.print();
    };
    return Thing3;
}(Thing2);
// Repro from #13805
var Timestamped = function(Base1) {
    return /*#__PURE__*/ function(Base) {
        "use strict";
        _inherits(_class, Base);
        var _super = _create_super(_class);
        function _class() {
            _class_call_check(this, _class);
            var _this;
            _this = _super.apply(this, arguments);
            _this.timestamp = new Date();
            return _this;
        }
        return _class;
    }(Base1);
};

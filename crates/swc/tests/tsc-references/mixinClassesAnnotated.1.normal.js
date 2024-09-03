//// [mixinClassesAnnotated.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
var Base = function Base(x, y) {
    "use strict";
    _class_call_check(this, Base);
    this.x = x;
    this.y = y;
};
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived, Base);
    function Derived(x, y, z) {
        _class_call_check(this, Derived);
        var _this;
        _this = _call_super(this, Derived, [
            x,
            y
        ]), _this.z = z;
        return _this;
    }
    return Derived;
}(Base);
var Printable = function(superClass) {
    var _class = /*#__PURE__*/ function(superClass) {
        "use strict";
        _inherits(_class, superClass);
        function _class() {
            _class_call_check(this, _class);
            return _call_super(this, _class, arguments);
        }
        var _proto = _class.prototype;
        _proto.print = function print() {
            var output = this.x + "," + this.y;
        };
        return _class;
    }(superClass);
    _class.message = "hello";
    return _class;
};
function Tagged(superClass) {
    var C = /*#__PURE__*/ function(superClass) {
        "use strict";
        _inherits(C, superClass);
        function C() {
            for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                args[_key] = arguments[_key];
            }
            _class_call_check(this, C);
            var _this;
            _this = _call_super(this, C, _to_consumable_array(args));
            _this._tag = "hello";
            return _this;
        }
        return C;
    }(superClass);
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
var Thing3 = /*#__PURE__*/ function(Thing2) {
    "use strict";
    _inherits(Thing3, Thing2);
    function Thing3(tag) {
        _class_call_check(this, Thing3);
        var _this;
        _this = _call_super(this, Thing3, [
            10,
            20,
            30
        ]);
        _this._tag = tag;
        return _this;
    }
    var _proto = Thing3.prototype;
    _proto.test = function test() {
        this.print();
    };
    return Thing3;
}(Thing2);

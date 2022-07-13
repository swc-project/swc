//@target: ES6
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var Bar = function Bar() {
    "use strict";
    _class_call_check(this, Bar);
};
var Foo = /*#__PURE__*/ function(Bar) {
    "use strict";
    _inherits(Foo, Bar);
    var _super = _create_super(Foo);
    function Foo() {
        _class_call_check(this, Foo);
        return _super.apply(this, arguments);
    }
    return Foo;
}(Bar);
var FooArrayIterator = /*#__PURE__*/ function() {
    "use strict";
    function FooArrayIterator() {
        _class_call_check(this, FooArrayIterator);
    }
    var _proto = FooArrayIterator.prototype;
    _proto.next = function next() {
        return {
            value: [
                new Foo
            ],
            done: false
        };
    };
    _proto[Symbol.iterator] = function() {
        return this;
    };
    return FooArrayIterator;
}();
function fun() {
    for(var _len = arguments.length, _tmp = new Array(_len), _key = 0; _key < _len; _key++){
        _tmp[_key] = arguments[_key];
    }
    var __tmp = _sliced_to_array(_tmp, 2), ref = _sliced_to_array(__tmp[0], 1), tmp = ref[0], a = tmp === void 0 ? new Foo : tmp, tmp1 = __tmp[1], b = tmp1 === void 0 ? [
        new Foo
    ] : tmp1;
}
fun.apply(void 0, _to_consumable_array(new FooArrayIterator));

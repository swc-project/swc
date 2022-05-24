import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _sliced_to_array from "@swc/helpers/lib/_sliced_to_array.js";
import _to_consumable_array from "@swc/helpers/lib/_to_consumable_array.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
//@target: ES6
function fun() {
    for(var _len = arguments.length, _tmp = new Array(_len), _key = 0; _key < _len; _key++){
        _tmp[_key] = arguments[_key];
    }
    var __tmp = _sliced_to_array(_tmp, 2), a = __tmp[0], b = __tmp[1];
}
fun.apply(void 0, _to_consumable_array(new FooIteratorIterator));
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
var _iterator = Symbol.iterator;
var FooIterator = /*#__PURE__*/ function() {
    "use strict";
    function FooIterator() {
        _class_call_check(this, FooIterator);
    }
    var _proto = FooIterator.prototype;
    _proto.next = function next() {
        return {
            value: new Foo,
            done: false
        };
    };
    _proto[_iterator] = function() {
        return this;
    };
    return FooIterator;
}();
var _iterator1 = Symbol.iterator;
var FooIteratorIterator = /*#__PURE__*/ function() {
    "use strict";
    function FooIteratorIterator() {
        _class_call_check(this, FooIteratorIterator);
    }
    var _proto = FooIteratorIterator.prototype;
    _proto.next = function next() {
        return {
            value: new FooIterator,
            done: false
        };
    };
    _proto[_iterator1] = function() {
        return this;
    };
    return FooIteratorIterator;
}();

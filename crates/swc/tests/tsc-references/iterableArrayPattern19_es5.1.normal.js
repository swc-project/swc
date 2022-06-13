import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
//@target: ES6
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
function fun(param) {
    var _param = _sliced_to_array(param, 2), ref = _sliced_to_array(_param[0], 1), a = ref[0], b = _param[1];
}
fun(new FooArrayIterator);

import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _sliced_to_array from "@swc/helpers/lib/_sliced_to_array.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var Bar = function() {
    "use strict";
    _class_call_check(this, Bar);
}, Foo = function(Bar1) {
    "use strict";
    _inherits(Foo, Bar1);
    var _super = _create_super(Foo);
    function Foo() {
        return _class_call_check(this, Foo), _super.apply(this, arguments);
    }
    return Foo;
}(Bar), _iterator = Symbol.iterator, FooArrayIterator = function() {
    "use strict";
    function FooArrayIterator() {
        _class_call_check(this, FooArrayIterator);
    }
    var _proto = FooArrayIterator.prototype;
    return _proto.next = function() {
        return {
            value: [
                new Foo
            ],
            done: !1
        };
    }, _proto[_iterator] = function() {
        return this;
    }, FooArrayIterator;
}();
!function(param) {
    var _param = _sliced_to_array(param, 2);
    _sliced_to_array(_param[0], 1)[0], _param[1];
}(new FooArrayIterator);

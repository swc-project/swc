import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var Bar = function() {
    "use strict";
    _class_call_check(this, Bar);
}, Foo = function(Bar) {
    "use strict";
    _inherits(Foo, Bar);
    var _super = _create_super(Foo);
    function Foo() {
        return _class_call_check(this, Foo), _super.apply(this, arguments);
    }
    return Foo;
}(Bar), FooArrayIterator = function() {
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
    }, _proto[Symbol.iterator] = function() {
        return this;
    }, FooArrayIterator;
}();
(function() {
    for(var _len = arguments.length, _tmp = Array(_len), _key = 0; _key < _len; _key++)_tmp[_key] = arguments[_key];
    var __tmp = _sliced_to_array(_tmp, 2);
    void 0 === (void 0 === _sliced_to_array(__tmp[0], 1)[0] && new Foo, __tmp[1]) && new Foo;
}).apply(void 0, _to_consumable_array(new FooArrayIterator));

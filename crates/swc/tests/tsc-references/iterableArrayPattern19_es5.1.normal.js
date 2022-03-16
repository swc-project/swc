import * as swcHelpers from "@swc/helpers";
//@target: ES6
var Bar = function Bar() {
    "use strict";
    swcHelpers.classCallCheck(this, Bar);
};
var Foo = /*#__PURE__*/ function(Bar) {
    "use strict";
    swcHelpers.inherits(Foo, Bar);
    var _super = swcHelpers.createSuper(Foo);
    function Foo() {
        swcHelpers.classCallCheck(this, Foo);
        return _super.apply(this, arguments);
    }
    return Foo;
}(Bar);
var _iterator = Symbol.iterator;
var FooArrayIterator = /*#__PURE__*/ function() {
    "use strict";
    function FooArrayIterator() {
        swcHelpers.classCallCheck(this, FooArrayIterator);
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
    _proto[_iterator] = function() {
        return this;
    };
    return FooArrayIterator;
}();
function fun(param) {
    var _param = swcHelpers.slicedToArray(param, 2), ref = swcHelpers.slicedToArray(_param[0], 1), a = ref[0], b = _param[1];
}
fun(new FooArrayIterator);

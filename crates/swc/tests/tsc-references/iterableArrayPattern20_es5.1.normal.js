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
function fun() {
    for(var _len = arguments.length, _tmp = new Array(_len), _key = 0; _key < _len; _key++){
        _tmp[_key] = arguments[_key];
    }
    var __tmp = swcHelpers.slicedToArray(_tmp, 2), ref = swcHelpers.slicedToArray(__tmp[0], 1), tmp = ref[0], a = tmp === void 0 ? new Foo : tmp, tmp1 = __tmp[1], b = tmp1 === void 0 ? [
        new Foo
    ] : tmp1;
}
fun.apply(void 0, swcHelpers.toConsumableArray(new FooArrayIterator));

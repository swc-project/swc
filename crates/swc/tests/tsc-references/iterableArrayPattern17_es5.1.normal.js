import * as swcHelpers from "@swc/helpers";
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
var FooIterator = /*#__PURE__*/ function() {
    "use strict";
    function FooIterator() {
        swcHelpers.classCallCheck(this, FooIterator);
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
function fun() {
    for(var _len = arguments.length, _tmp = new Array(_len), _key = 0; _key < _len; _key++){
        _tmp[_key] = arguments[_key];
    }
    var __tmp = swcHelpers.slicedToArray(_tmp, 2), a = __tmp[0], b = __tmp[1];
}
fun(new FooIterator);

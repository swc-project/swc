import * as swcHelpers from "@swc/helpers";
var Bar = function() {
    "use strict";
    swcHelpers.classCallCheck(this, Bar);
}, Foo = function(Bar1) {
    "use strict";
    swcHelpers.inherits(Foo, Bar1);
    var _super = swcHelpers.createSuper(Foo);
    function Foo() {
        return swcHelpers.classCallCheck(this, Foo), _super.apply(this, arguments);
    }
    return Foo;
}(Bar), _iterator = Symbol.iterator, FooArrayIterator = function() {
    "use strict";
    function FooArrayIterator() {
        swcHelpers.classCallCheck(this, FooArrayIterator);
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
(function() {
    for(var _len = arguments.length, _tmp = new Array(_len), _key = 0; _key < _len; _key++)_tmp[_key] = arguments[_key];
    var __tmp = swcHelpers.slicedToArray(_tmp, 2);
    void 0 === swcHelpers.slicedToArray(__tmp[0], 1)[0] && new Foo, void 0 === __tmp[1] && new Foo;
}).apply(void 0, swcHelpers.toConsumableArray(new FooArrayIterator));

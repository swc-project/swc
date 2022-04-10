import * as swcHelpers from "@swc/helpers";
var Bar = function() {
    swcHelpers.classCallCheck(this, Bar);
}, Foo = function(Bar1) {
    swcHelpers.inherits(Foo, Bar1);
    var _super = swcHelpers.createSuper(Foo);
    function Foo() {
        return swcHelpers.classCallCheck(this, Foo), _super.apply(this, arguments);
    }
    return Foo;
}(Bar), _iterator = Symbol.iterator, FooIterator = function() {
    function FooIterator() {
        swcHelpers.classCallCheck(this, FooIterator);
    }
    var _proto = FooIterator.prototype;
    return _proto.next = function() {
        return {
            value: new Foo,
            done: !1
        };
    }, _proto[_iterator] = function() {
        return this;
    }, FooIterator;
}();
!function() {
    for(var _len = arguments.length, _tmp = new Array(_len), _key = 0; _key < _len; _key++)_tmp[_key] = arguments[_key];
    var __tmp = swcHelpers.toArray(_tmp);
    __tmp[0], __tmp.slice(1);
}(new FooIterator);

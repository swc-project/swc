import * as swcHelpers from "@swc/helpers";
(function() {
    for(var _len = arguments.length, _tmp = new Array(_len), _key = 0; _key < _len; _key++)_tmp[_key] = arguments[_key];
    var __tmp = swcHelpers.slicedToArray(_tmp, 2);
    __tmp[0], __tmp[1];
}).apply(void 0, swcHelpers.toConsumableArray(new FooIteratorIterator));
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
}(Bar), _iterator = Symbol.iterator, FooIterator = function() {
    "use strict";
    function FooIterator() {
        swcHelpers.classCallCheck(this, FooIterator);
    }
    return swcHelpers.createClass(FooIterator, [
        {
            key: "next",
            value: function() {
                return {
                    value: new Foo,
                    done: !1
                };
            }
        },
        {
            key: _iterator,
            value: function() {
                return this;
            }
        }
    ]), FooIterator;
}(), _iterator1 = Symbol.iterator, FooIteratorIterator = function() {
    "use strict";
    function FooIteratorIterator() {
        swcHelpers.classCallCheck(this, FooIteratorIterator);
    }
    return swcHelpers.createClass(FooIteratorIterator, [
        {
            key: "next",
            value: function() {
                return {
                    value: new FooIterator,
                    done: !1
                };
            }
        },
        {
            key: _iterator1,
            value: function() {
                return this;
            }
        }
    ]), FooIteratorIterator;
}();

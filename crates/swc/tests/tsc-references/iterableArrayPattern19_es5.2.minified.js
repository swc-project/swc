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
    return swcHelpers.createClass(FooArrayIterator, [
        {
            key: "next",
            value: function() {
                return {
                    value: [
                        new Foo
                    ],
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
    ]), FooArrayIterator;
}();
!function(param) {
    var _param = swcHelpers.slicedToArray(param, 2);
    swcHelpers.slicedToArray(_param[0], 1)[0], _param[1];
}(new FooArrayIterator);

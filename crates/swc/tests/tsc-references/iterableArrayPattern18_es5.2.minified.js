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
}();
!function(param) {
    var _param = swcHelpers.slicedToArray(param, 2);
    _param[0], _param[1];
}(new FooIterator);

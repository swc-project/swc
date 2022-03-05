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
    swcHelpers.createClass(FooIterator, [
        {
            key: "next",
            value: function next() {
                return {
                    value: new Foo,
                    done: false
                };
            }
        },
        {
            key: _iterator,
            value: function value() {
                return this;
            }
        }
    ]);
    return FooIterator;
}();
function fun(param) {
    var _param = swcHelpers.slicedToArray(param, 2), a = _param[0], b = _param[1];
}
fun(new FooIterator);

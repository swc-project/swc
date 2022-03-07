import * as swcHelpers from "@swc/helpers";
var _isConcatSpreadable = Symbol.isConcatSpreadable;
var Foo = //@target: ES6
/*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        swcHelpers.classCallCheck(this, Foo);
    }
    var _proto = Foo.prototype;
    _proto[_isConcatSpreadable] = function() {
        return 0;
    };
    return Foo;
}();
var _isConcatSpreadable1 = Symbol.isConcatSpreadable;
var Bar = /*#__PURE__*/ function(Foo) {
    "use strict";
    swcHelpers.inherits(Bar, Foo);
    var _super = swcHelpers.createSuper(Bar);
    function Bar() {
        swcHelpers.classCallCheck(this, Bar);
        return _super.apply(this, arguments);
    }
    var _proto = Bar.prototype;
    _proto[_isConcatSpreadable1] = function() {
        return swcHelpers.get(swcHelpers.getPrototypeOf(Bar.prototype), Symbol.isConcatSpreadable, this).call(this);
    };
    return Bar;
}(Foo);

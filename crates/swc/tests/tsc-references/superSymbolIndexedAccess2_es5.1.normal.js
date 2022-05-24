import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _get from "@swc/helpers/lib/_get.js";
import _get_prototype_of from "@swc/helpers/lib/_get_prototype_of.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var _isConcatSpreadable = Symbol.isConcatSpreadable;
//@target: ES6
var Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo);
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
    _inherits(Bar, Foo);
    var _super = _create_super(Bar);
    function Bar() {
        _class_call_check(this, Bar);
        return _super.apply(this, arguments);
    }
    var _proto = Bar.prototype;
    _proto[_isConcatSpreadable1] = function() {
        return _get(_get_prototype_of(Bar.prototype), Symbol.isConcatSpreadable, this).call(this);
    };
    return Bar;
}(Foo);

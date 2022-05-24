import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _get from "@swc/helpers/lib/_get.js";
import _get_prototype_of from "@swc/helpers/lib/_get_prototype_of.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
//@target: ES5
var symbol;
var _symbol = symbol;
var Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo);
    }
    Foo[_symbol] = function() {
        return 0;
    };
    return Foo;
}();
var _symbol1 = symbol;
var Bar = /*#__PURE__*/ function(Foo) {
    "use strict";
    _inherits(Bar, Foo);
    var _super = _create_super(Bar);
    function Bar() {
        _class_call_check(this, Bar);
        return _super.apply(this, arguments);
    }
    Bar[_symbol1] = function() {
        return _get(_get_prototype_of(Bar), symbol, this).call(this);
    };
    return Bar;
}(Foo);

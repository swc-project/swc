//// [superSymbolIndexedAccess6.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var symbol;
var Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo);
    }
    Foo[symbol] = function() {
        return 0;
    };
    return Foo;
}();
var Bar = /*#__PURE__*/ function(Foo) {
    "use strict";
    _inherits(Bar, Foo);
    var _super = _create_super(Bar);
    function Bar() {
        _class_call_check(this, Bar);
        return _super.apply(this, arguments);
    }
    Bar[symbol] = function() {
        return _get(_get_prototype_of(Bar), symbol, this).call(this);
    };
    return Bar;
}(Foo);

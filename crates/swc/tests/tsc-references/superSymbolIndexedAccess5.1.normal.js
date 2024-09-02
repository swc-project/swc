//// [superSymbolIndexedAccess5.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var symbol;
var Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo);
    }
    var _proto = Foo.prototype;
    _proto[symbol] = function() {
        return 0;
    };
    return Foo;
}();
var Bar = /*#__PURE__*/ function(Foo) {
    "use strict";
    _inherits(Bar, Foo);
    function Bar() {
        _class_call_check(this, Bar);
        return _call_super(this, Bar, arguments);
    }
    var _proto = Bar.prototype;
    _proto[symbol] = function() {
        return _get(_get_prototype_of(Bar.prototype), symbol, this).call(this);
    };
    return Bar;
}(Foo);

import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _get from "@swc/helpers/lib/_get.js";
import _get_prototype_of from "@swc/helpers/lib/_get_prototype_of.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var symbol, Foo = function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo);
    }
    return Foo.prototype[symbol] = function() {
        return 0;
    }, Foo;
}(), Bar = function(Foo) {
    "use strict";
    _inherits(Bar, Foo);
    var _super = _create_super(Bar);
    function Bar() {
        return _class_call_check(this, Bar), _super.apply(this, arguments);
    }
    return Bar.prototype[symbol] = function() {
        return _get(_get_prototype_of(Bar.prototype), symbol, this).call(this);
    }, Bar;
}(Foo);

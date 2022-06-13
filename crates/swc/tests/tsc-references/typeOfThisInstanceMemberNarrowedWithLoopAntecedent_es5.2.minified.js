import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var SomeClass = function() {
    "use strict";
    function SomeClass() {
        _class_call_check(this, SomeClass);
    }
    return SomeClass.prototype.method = function() {
        this.state.data, "stringVariant" === this.state.type && this.state.data;
    }, SomeClass;
}(), SomeClass2 = function() {
    "use strict";
    function SomeClass2() {
        _class_call_check(this, SomeClass2);
    }
    return SomeClass2.prototype.method = function() {
        var ref;
        "numberVariant" === this.state.type && this.state.data, null === (ref = this.state) || void 0 === ref || ref.data;
    }, SomeClass2;
}();

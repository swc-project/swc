//// [typeOfThisInstanceMemberNarrowedWithLoopAntecedent.ts]
// #31995
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var SomeClass = /*#__PURE__*/ function() {
    "use strict";
    function SomeClass() {
        _class_call_check(this, SomeClass);
    }
    var _proto = SomeClass.prototype;
    _proto.method = function method() {
        while(0){}
        this.state.data;
        if (this.state.type === "stringVariant") {
            var s = this.state.data;
        }
    };
    return SomeClass;
}();
var SomeClass2 = /*#__PURE__*/ function() {
    "use strict";
    function SomeClass2() {
        _class_call_check(this, SomeClass2);
    }
    var _proto = SomeClass2.prototype;
    _proto.method = function method() {
        var _this_state;
        var c = false;
        while(c){}
        if (this.state.type === "numberVariant") {
            this.state.data;
        }
        var n = (_this_state = this.state) === null || _this_state === void 0 ? void 0 : _this_state.data; // This should be an error
    };
    return SomeClass2;
}();

import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @noImplicitAny: true
// @noImplicitThis: true
var MyClass = /*#__PURE__*/ function() {
    "use strict";
    function MyClass() {
        _class_call_check(this, MyClass);
    }
    var _proto = MyClass.prototype;
    _proto.fn = function fn() {
        //type of 'this' in an object literal is the containing scope's this
        var t = {
            x: this,
            y: this.t
        };
        var t;
    };
    return MyClass;
}();
//type of 'this' in an object literal method is the type of the object literal
var obj = {
    f: function f() {
        return this.spaaace;
    }
};
var obj;

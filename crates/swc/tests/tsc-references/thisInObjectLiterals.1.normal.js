//// [thisInObjectLiterals.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
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

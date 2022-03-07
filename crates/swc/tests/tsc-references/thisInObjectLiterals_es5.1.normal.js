import * as swcHelpers from "@swc/helpers";
var MyClass = // @noImplicitAny: true
// @noImplicitThis: true
/*#__PURE__*/ function() {
    "use strict";
    function MyClass() {
        swcHelpers.classCallCheck(this, MyClass);
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

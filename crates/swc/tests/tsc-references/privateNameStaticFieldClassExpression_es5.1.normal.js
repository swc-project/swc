import * as swcHelpers from "@swc/helpers";
var _class, _Foo;
// @target: es2015
var B = /*#__PURE__*/ function() {
    "use strict";
    function B() {
        swcHelpers.classCallCheck(this, B);
    }
    var _proto = B.prototype;
    _proto.m = function m() {
        console.log(swcHelpers.classStaticPrivateFieldSpecGet(B, B, _foo).test);
        swcHelpers.classStaticPrivateFieldSpecGet(B, B, _foo).test = 10;
        new (swcHelpers.classStaticPrivateFieldSpecGet(B, B, _foo))().field;
    };
    return B;
}();
var _foo = {
    writable: true,
    value: (_class = function _class1() {
        "use strict";
        swcHelpers.classCallCheck(this, _class1);
        this.field = 10;
        console.log("hello");
        new (swcHelpers.classStaticPrivateFieldSpecGet(B, B, _foo2))();
    }, _class.test = 123, _class)
};
var _foo2 = {
    writable: true,
    value: (_Foo = function Foo() {
        "use strict";
        swcHelpers.classCallCheck(this, Foo);
    }, _Foo.otherClass = 123, _Foo)
};

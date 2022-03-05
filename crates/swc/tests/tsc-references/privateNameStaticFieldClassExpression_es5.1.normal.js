import * as swcHelpers from "@swc/helpers";
var _class, _Foo;
var B = // @target: es2015
/*#__PURE__*/ function() {
    "use strict";
    function B() {
        swcHelpers.classCallCheck(this, B);
    }
    swcHelpers.createClass(B, [
        {
            key: "m",
            value: function m() {
                console.log(swcHelpers.classStaticPrivateFieldSpecGet(B, B, _foo).test);
                swcHelpers.classStaticPrivateFieldSpecGet(B, B, _foo).test = 10;
                new (swcHelpers.classStaticPrivateFieldSpecGet(B, B, _foo))().field;
            }
        }
    ]);
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

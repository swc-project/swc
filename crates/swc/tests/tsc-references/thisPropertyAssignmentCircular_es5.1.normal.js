import * as swcHelpers from "@swc/helpers";
// @allowJs: true
// @checkJs: true
// @declaration: true
// @emitDeclarationOnly: true
// @filename: thisPropertyAssignmentCircular.js
export var Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        swcHelpers.classCallCheck(this, Foo);
        this.foo = "Hello";
    }
    swcHelpers.createClass(Foo, [
        {
            key: "slicey",
            value: function slicey() {
                this.foo = this.foo.slice();
            }
        },
        {
            key: "m",
            value: function m() {
                this.foo;
            }
        }
    ]);
    return Foo;
}();
/** @class */ function C() {
    this.x = 0;
    this.x = function() {
        this.x.toString();
    };
}

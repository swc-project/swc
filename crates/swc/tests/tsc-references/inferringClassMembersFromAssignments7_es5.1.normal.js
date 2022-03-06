import * as swcHelpers from "@swc/helpers";
var C = // @noEmit: true
// @allowJs: true
// @checkJs: true
// @noImplicitAny: true
// @strictNullChecks: true
// @Filename: inferringClassMembersFromAssignments7.js
/*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
        var self = this;
        self.x = 1;
        self.m = function() {
            console.log(self.x);
        };
    }
    swcHelpers.createClass(C, [
        {
            key: "mreal",
            value: function mreal() {
                var self = this;
                self.y = 2;
            }
        }
    ]);
    return C;
}();
var c = new C();
c.x;
c.y;
c.m();

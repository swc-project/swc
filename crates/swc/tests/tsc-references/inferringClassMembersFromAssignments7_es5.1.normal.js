function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
var C = // @noEmit: true
// @allowJs: true
// @checkJs: true
// @noImplicitAny: true
// @strictNullChecks: true
// @Filename: inferringClassMembersFromAssignments7.js
/*#__PURE__*/ function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
        var self = this;
        self.x = 1;
        self.m = function() {
            console.log(self.x);
        };
    }
    _createClass(C, [
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

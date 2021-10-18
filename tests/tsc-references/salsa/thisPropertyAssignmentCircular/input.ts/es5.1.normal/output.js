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
// @allowJs: true
// @checkJs: true
// @declaration: true
// @emitDeclarationOnly: true
// @filename: thisPropertyAssignmentCircular.js
export var Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        _classCallCheck(this, Foo);
        this.foo = "Hello";
    }
    _createClass(Foo, [
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

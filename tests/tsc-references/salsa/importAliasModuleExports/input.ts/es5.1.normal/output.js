// @filename: main.js
import A from './mod1';
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
var Alias = // @allowJs: true
// @checkJs: true
// @noEmit: true
// @esModuleInterop: true
// @filename: mod1.js
/*#__PURE__*/ function() {
    "use strict";
    function Alias() {
        _classCallCheck(this, Alias);
    }
    _createClass(Alias, [
        {
            key: "bar",
            value: function bar() {
                return 1;
            }
        }
    ]);
    return Alias;
}();
module.exports = Alias;
A.prototype.foo = 0;
A.prototype.func = function() {
    this._func = 0;
};
Object.defineProperty(A.prototype, "def", {
    value: 0
});
new A().bar;
new A().foo;
new A().func();
new A().def;

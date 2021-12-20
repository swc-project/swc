import A from "./mod1";
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var Alias = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function Alias() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, Alias);
    }
    return protoProps = [
        {
            key: "bar",
            value: function() {
                return 1;
            }
        }
    ], _defineProperties((Constructor = Alias).prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Alias;
}();
module.exports = Alias, A.prototype.foo = 0, A.prototype.func = function() {
    this._func = 0;
}, Object.defineProperty(A.prototype, "def", {
    value: 0
}), new A().bar, new A().foo, new A().func(), new A().def;

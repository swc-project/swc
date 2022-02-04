function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Constructor;
}
var Explicit = function() {
    "use strict";
    function Explicit() {
        _classCallCheck(this, Explicit), this.n = 17;
    }
    return _createClass(Explicit, [
        {
            key: "x",
            get: function() {
                return this.n;
            },
            set: function(n) {
                this.n = n;
            }
        }
    ]), Explicit;
}(), Contextual = function() {
    "use strict";
    function Contextual() {
        _classCallCheck(this, Contextual), this.n = 21;
    }
    return _createClass(Contextual, [
        {
            key: "x",
            get: function() {
                return this.n;
            }
        }
    ]), Contextual;
}();

function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var Axios = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function Axios() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, Axios);
    }
    return protoProps = [
        {
            key: "m",
            value: function() {
            }
        }
    ], _defineProperties((Constructor = Axios).prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Axios;
}(), axios = new Axios();
axios.m(), module.exports = axios, module.exports.default = axios;

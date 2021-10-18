function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
require("./mod1").K;
var NS = {
};
NS.K = (function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function _class() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, _class);
    }
    return Constructor = _class, protoProps = [
        {
            key: "values",
            value: function() {
                return new NS.K();
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), _class;
})(), exports.K = NS.K;

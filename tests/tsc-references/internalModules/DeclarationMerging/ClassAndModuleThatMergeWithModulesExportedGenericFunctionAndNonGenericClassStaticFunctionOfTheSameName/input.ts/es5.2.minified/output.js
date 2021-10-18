function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var clodule = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function clodule() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, clodule);
    }
    return Constructor = clodule, protoProps = null, staticProps = [
        {
            key: "fn",
            value: function(id) {
            }
        }
    ], protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), clodule;
}();
(clodule || (clodule = {
})).fn = function(x, y) {
    return x;
};

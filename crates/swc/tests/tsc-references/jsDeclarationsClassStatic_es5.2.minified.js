function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var Handler = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function Handler() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, Handler);
    }
    return staticProps = [
        {
            key: "OPTIONS",
            get: function() {
                return 1;
            }
        }
    ], protoProps = [
        {
            key: "process",
            value: function() {}
        }
    ], _defineProperties((Constructor = Handler).prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Handler;
}();
Handler.statische = function() {}, module.exports = Handler, module.exports.Strings = {
    a: "A",
    b: "B"
};

function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var Bar = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function Bar() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, Bar);
    }
    return Constructor = Bar, protoProps = [
        {
            key: "cast",
            value: function(_name) {
            }
        },
        {
            key: "pushThis",
            value: function() {
                Bar.instance.push(this);
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Bar;
}();

function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var _sym = Symbol("_sym");
export var MyClass = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function MyClass() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, MyClass);
        var self = this;
        self[_sym] = "ok";
    }
    return Constructor = MyClass, protoProps = [
        {
            key: "method",
            value: function() {
                var self = this;
                self[_sym] = "yep", self[_sym];
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), MyClass;
}();

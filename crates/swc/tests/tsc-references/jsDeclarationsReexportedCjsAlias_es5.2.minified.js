function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var SomeClass = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function SomeClass() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, SomeClass);
    }
    return protoProps = [
        {
            key: "a",
            value: function() {
                return 1;
            }
        }
    ], _defineProperties((Constructor = SomeClass).prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), SomeClass;
}();
module.exports = {
    bar: function(a) {
        return a + a;
    },
    SomeClass: SomeClass
};
var ref = require("./lib"), SomeClass = ref.SomeClass, Another = ref.SomeClass;
module.exports = {
    SomeClass: SomeClass,
    Another: Another
};

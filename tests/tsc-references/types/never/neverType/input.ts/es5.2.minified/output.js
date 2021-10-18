function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function error(message) {
    throw new Error(message);
}
var C = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function C() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, C);
    }
    return Constructor = C, protoProps = [
        {
            key: "void1",
            value: function() {
                throw new Error();
            }
        },
        {
            key: "void2",
            value: function() {
                for(;;);
            }
        },
        {
            key: "never1",
            value: function() {
                throw new Error();
            }
        },
        {
            key: "never2",
            value: function() {
                for(;;);
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}();
function test(cb) {
    return cb();
}
test(function() {
    return "hello";
}), test(function() {
    return error("Something failed");
}), test(function() {
    throw new Error();
}), test(function() {
    return error("Error callback");
});

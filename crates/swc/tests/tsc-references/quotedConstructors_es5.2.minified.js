function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var C = function() {
    "use strict";
    _classCallCheck(this, C), console.log(this);
}, D = function() {
    "use strict";
    _classCallCheck(this, D), console.log(this);
}, E = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function E() {
        _classCallCheck(this, E);
    }
    return Constructor = E, protoProps = [
        {
            key: "constructor",
            value: function() {
                console.log(this);
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), E;
}();
new function _class() {
    "use strict";
    _classCallCheck(this, _class), console.log(this);
};
var F = function() {
    "use strict";
    _classCallCheck(this, F), console.log(this);
};

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var Conn = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function Conn() {
        _classCallCheck(this, Conn), this.item = 3;
    }
    return protoProps = [
        {
            key: "method",
            value: function() {
            }
        }
    ], _defineProperties((Constructor = Conn).prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Conn;
}();
module.exports = Conn;
var Wrap = function(c) {
    "use strict";
    _classCallCheck(this, Wrap), this.connItem = c.item, this.another = "";
};
module.exports = {
    Wrap: Wrap
};

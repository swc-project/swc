function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
var Conn = // @allowJs: true
// @checkJs: true
// @outDir: ./out
// @declaration: true
// @filename: conn.js
/**
 * @typedef {string | number} Whatever
 */ /*#__PURE__*/ function() {
    "use strict";
    function Conn() {
        _classCallCheck(this, Conn);
        this.item = 3;
    }
    _createClass(Conn, [
        {
            key: "method",
            value: function method() {
            }
        }
    ]);
    return Conn;
}();
module.exports = Conn;
var Wrap = function Wrap(c) {
    "use strict";
    _classCallCheck(this, Wrap);
    this.connItem = c.item;
    /** @type {import("./conn").Whatever} */ this.another = "";
};
module.exports = {
    Wrap: Wrap
};

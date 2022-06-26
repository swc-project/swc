import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @allowJs: true
// @checkJs: true
// @outDir: ./out
// @declaration: true
// @filename: conn.js
/**
 * @typedef {string | number} Whatever
 */ var Conn = /*#__PURE__*/ function() {
    "use strict";
    function Conn() {
        _class_call_check(this, Conn);
        this.item = 3;
    }
    var _proto = Conn.prototype;
    _proto.method = function method() {};
    return Conn;
}();
module.exports = Conn;
// @filename: usage.js
/**
 * @typedef {import("./conn")} Conn
 */ var Wrap = function Wrap(c) {
    "use strict";
    _class_call_check(this, Wrap);
    this.connItem = c.item;
    /** @type {import("./conn").Whatever} */ this.another = "";
};
module.exports = {
    Wrap: Wrap
};

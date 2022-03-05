import * as swcHelpers from "@swc/helpers";
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
        swcHelpers.classCallCheck(this, Conn);
        this.item = 3;
    }
    swcHelpers.createClass(Conn, [
        {
            key: "method",
            value: function method() {}
        }
    ]);
    return Conn;
}();
module.exports = Conn;
var Wrap = function Wrap(c) {
    "use strict";
    swcHelpers.classCallCheck(this, Wrap);
    this.connItem = c.item;
    /** @type {import("./conn").Whatever} */ this.another = "";
};
module.exports = {
    Wrap: Wrap
};

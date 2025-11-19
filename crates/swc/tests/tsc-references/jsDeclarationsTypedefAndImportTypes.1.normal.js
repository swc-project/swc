//// [conn.js]
/**
 * @typedef {string | number} Whatever
 */ import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var Conn = /*#__PURE__*/ function() {
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
//// [usage.js]
/**
 * @typedef {import("./conn")} Conn
 */ import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var Wrap = function Wrap(c) {
    "use strict";
    _class_call_check(this, Wrap);
    this.connItem = c.item;
    /** @type {import("./conn").Whatever} */ this.another = "";
};
module.exports = {
    Wrap: Wrap
};

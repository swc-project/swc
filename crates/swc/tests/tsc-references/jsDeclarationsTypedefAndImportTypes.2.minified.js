//// [conn.js]
/**
 * @typedef {string | number} Whatever
 */ import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var Conn = function() {
    function Conn() {
        _class_call_check(this, Conn), this.item = 3;
    }
    return Conn.prototype.method = function() {}, Conn;
}();
module.exports = Conn;
//// [usage.js]
/**
 * @typedef {import("./conn")} Conn
 */ import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
module.exports = {
    Wrap: function Wrap(c) {
        _class_call_check(this, Wrap), this.connItem = c.item, /** @type {import("./conn").Whatever} */ this.another = "";
    }
};

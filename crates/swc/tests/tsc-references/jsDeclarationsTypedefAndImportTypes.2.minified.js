//// [conn.js]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Conn = function() {
    "use strict";
    function Conn() {
        _class_call_check(this, Conn), this.item = 3;
    }
    return Conn.prototype.method = function() {}, Conn;
}();
module.exports = Conn;
//// [usage.js]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
module.exports = {
    Wrap: function Wrap(c) {
        "use strict";
        _class_call_check(this, Wrap), this.connItem = c.item, this.another = "";
    }
};

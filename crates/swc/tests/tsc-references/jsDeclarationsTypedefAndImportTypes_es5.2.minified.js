import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var Conn = function() {
    "use strict";
    function Conn() {
        _class_call_check(this, Conn), this.item = 3;
    }
    return Conn.prototype.method = function() {}, Conn;
}();
module.exports = Conn;
var Wrap = function(c) {
    "use strict";
    _class_call_check(this, Wrap), this.connItem = c.item, this.another = "";
};
module.exports = {
    Wrap: Wrap
};

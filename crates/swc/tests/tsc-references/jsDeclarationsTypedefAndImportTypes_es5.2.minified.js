import * as swcHelpers from "@swc/helpers";
var Conn = function() {
    function Conn() {
        swcHelpers.classCallCheck(this, Conn), this.item = 3;
    }
    return Conn.prototype.method = function() {}, Conn;
}();
module.exports = Conn;
var Wrap = function(c) {
    swcHelpers.classCallCheck(this, Wrap), this.connItem = c.item, this.another = "";
};
module.exports = {
    Wrap: Wrap
};

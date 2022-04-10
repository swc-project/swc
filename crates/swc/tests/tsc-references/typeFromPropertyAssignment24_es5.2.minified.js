import * as swcHelpers from "@swc/helpers";
Outer.Inner.Message = function() {}, new Outer.Inner().name, x.name;
var x, Outer = {};
Outer.Inner = function() {
    function _class() {
        swcHelpers.classCallCheck(this, _class);
    }
    return _class.prototype.name = function() {
        return "hi";
    }, _class;
}();

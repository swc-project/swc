import * as swcHelpers from "@swc/helpers";
new (function() {
    function _class() {
        swcHelpers.classCallCheck(this, _class);
    }
    return _class.prototype.hi = function() {
        return "Hi!";
    }, _class;
}())().hi();

import * as swcHelpers from "@swc/helpers";
var C = function() {
    "use strict";
    function _class() {
        swcHelpers.classCallCheck(this, _class);
    }
    return _class.prototype.foo = function() {
        return new C();
    }, _class;
}();
(new C).foo();

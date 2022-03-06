import * as swcHelpers from "@swc/helpers";
var C = function() {
    "use strict";
    function _class() {
        swcHelpers.classCallCheck(this, _class);
    }
    return swcHelpers.createClass(_class, [
        {
            key: "foo",
            value: function() {
                return new C();
            }
        }
    ]), _class;
}();
(new C).foo();

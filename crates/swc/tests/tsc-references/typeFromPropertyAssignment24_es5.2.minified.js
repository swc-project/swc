import * as swcHelpers from "@swc/helpers";
Outer.Inner.Message = function() {}, new Outer.Inner().name, x.name;
var x, Outer = {};
Outer.Inner = (function() {
    "use strict";
    function _class() {
        swcHelpers.classCallCheck(this, _class);
    }
    return swcHelpers.createClass(_class, [
        {
            key: "name",
            value: function() {
                return "hi";
            }
        }
    ]), _class;
})();

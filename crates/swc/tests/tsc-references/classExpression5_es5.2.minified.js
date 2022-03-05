import * as swcHelpers from "@swc/helpers";
new (function() {
    "use strict";
    function _class() {
        swcHelpers.classCallCheck(this, _class);
    }
    return swcHelpers.createClass(_class, [
        {
            key: "hi",
            value: function() {
                return "Hi!";
            }
        }
    ]), _class;
}())().hi();

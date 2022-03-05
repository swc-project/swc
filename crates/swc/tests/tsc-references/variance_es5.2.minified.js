import * as swcHelpers from "@swc/helpers";
var Bar = function() {
    "use strict";
    function Bar() {
        swcHelpers.classCallCheck(this, Bar);
    }
    return swcHelpers.createClass(Bar, [
        {
            key: "cast",
            value: function(_name) {}
        },
        {
            key: "pushThis",
            value: function() {
                Bar.instance.push(this);
            }
        }
    ]), Bar;
}();
Bar.instance = [];

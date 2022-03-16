import * as swcHelpers from "@swc/helpers";
var Bar = function() {
    "use strict";
    function Bar() {
        swcHelpers.classCallCheck(this, Bar);
    }
    var _proto = Bar.prototype;
    return _proto.cast = function(_name) {}, _proto.pushThis = function() {
        Bar.instance.push(this);
    }, Bar;
}();
Bar.instance = [];

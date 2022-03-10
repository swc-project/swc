import * as swcHelpers from "@swc/helpers";
var foo = {
    prop: true
};
var x = foo;
var y = foo;
var z = x;
// Repro from #30118
var Bar = /*#__PURE__*/ function() {
    "use strict";
    function Bar() {
        swcHelpers.classCallCheck(this, Bar);
    }
    var _proto = Bar.prototype;
    _proto.cast = function cast(_name) {};
    _proto.pushThis = function pushThis() {
        Bar.instance.push(this);
    };
    return Bar;
}();
Bar.instance = [];

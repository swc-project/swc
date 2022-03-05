import * as swcHelpers from "@swc/helpers";
var foo = {
    prop: true
};
var x = foo;
var y = foo;
var z = x;
var Bar = // Repro from #30118
/*#__PURE__*/ function() {
    "use strict";
    function Bar() {
        swcHelpers.classCallCheck(this, Bar);
    }
    swcHelpers.createClass(Bar, [
        {
            key: "cast",
            value: function cast(_name) {}
        },
        {
            key: "pushThis",
            value: function pushThis() {
                Bar.instance.push(this);
            }
        }
    ]);
    return Bar;
}();
Bar.instance = [];

import * as swcHelpers from "@swc/helpers";
var C = /*#__PURE__*/ function(Component) {
    "use strict";
    swcHelpers.inherits(C, Component);
    var _super = swcHelpers.createSuper(C);
    function C() {
        swcHelpers.classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(Component);
var y = new C({
    foobar: "example"
});
var x = /*#__PURE__*/ React.createElement(C, {
    foobar: "example"
});

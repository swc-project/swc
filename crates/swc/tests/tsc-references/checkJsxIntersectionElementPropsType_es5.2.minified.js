import * as swcHelpers from "@swc/helpers";
var C = function(Component) {
    "use strict";
    swcHelpers.inherits(C, Component);
    var _super = swcHelpers.createSuper(C);
    function C() {
        return swcHelpers.classCallCheck(this, C), _super.apply(this, arguments);
    }
    return C;
}(Component);
new C({
    foobar: "example"
});

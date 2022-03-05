import * as swcHelpers from "@swc/helpers";
var React = require("react");
export var AddressComp = function(_Component) {
    "use strict";
    swcHelpers.inherits(AddressComp, _Component);
    var _super = swcHelpers.createSuper(AddressComp);
    function AddressComp() {
        return swcHelpers.classCallCheck(this, AddressComp), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(AddressComp, [
        {
            key: "render",
            value: function() {
                return null;
            }
        }
    ]), AddressComp;
}(React.Component);
React.createElement(AddressComp, {
    postalCode: "T1B 0L3",
    street: "vancouver",
    country: "CA"
});

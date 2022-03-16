import * as swcHelpers from "@swc/helpers";
// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
var React = require('react');
export var AddressComp = /*#__PURE__*/ function(_Component) {
    "use strict";
    swcHelpers.inherits(AddressComp, _Component);
    var _super = swcHelpers.createSuper(AddressComp);
    function AddressComp() {
        swcHelpers.classCallCheck(this, AddressComp);
        return _super.apply(this, arguments);
    }
    var _proto = AddressComp.prototype;
    _proto.render = function render() {
        return null;
    };
    return AddressComp;
}(React.Component);
var a = /*#__PURE__*/ React.createElement(AddressComp, {
    postalCode: "T1B 0L3",
    street: "vancouver",
    country: "CA"
});

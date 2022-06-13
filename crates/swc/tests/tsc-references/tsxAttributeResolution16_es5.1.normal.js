import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
var React = require("react");
export var AddressComp = /*#__PURE__*/ function(_Component) {
    "use strict";
    _inherits(AddressComp, _Component);
    var _super = _create_super(AddressComp);
    function AddressComp() {
        _class_call_check(this, AddressComp);
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

import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
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

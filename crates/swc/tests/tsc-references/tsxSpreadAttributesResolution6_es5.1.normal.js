import * as swcHelpers from "@swc/helpers";
// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
var React = require("react");
var TextComponent = /*#__PURE__*/ function(_Component) {
    "use strict";
    swcHelpers.inherits(TextComponent, _Component);
    var _super = swcHelpers.createSuper(TextComponent);
    function TextComponent() {
        swcHelpers.classCallCheck(this, TextComponent);
        return _super.apply(this, arguments);
    }
    var _proto = TextComponent.prototype;
    _proto.render = function render() {
        return /*#__PURE__*/ React.createElement("span", null, "Some Text..");
    };
    return TextComponent;
}(React.Component);
// Error
var x = /*#__PURE__*/ React.createElement(TextComponent, {
    editable: true
});
var textProps = {
    editable: false
};
export { };

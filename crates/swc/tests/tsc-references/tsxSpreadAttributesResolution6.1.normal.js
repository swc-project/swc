//// [file.tsx]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var TextComponent = /*#__PURE__*/ function(_React_Component) {
    "use strict";
    _inherits(TextComponent, _React_Component);
    function TextComponent() {
        _class_call_check(this, TextComponent);
        return _call_super(this, TextComponent, arguments);
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

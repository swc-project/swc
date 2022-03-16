import * as swcHelpers from "@swc/helpers";
// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
const React = require('react');
class TextComponent extends React.Component {
    render() {
        return /*#__PURE__*/ React.createElement("span", null, "Some Text..");
    }
}
// OK
const textPropsFalse = {
    editable: false
};
let y1 = /*#__PURE__*/ React.createElement(TextComponent, swcHelpers.extends({}, textPropsFalse));
const textPropsTrue = {
    editable: true,
    onEdit: ()=>{}
};
let y2 = /*#__PURE__*/ React.createElement(TextComponent, swcHelpers.extends({}, textPropsTrue));
export { };

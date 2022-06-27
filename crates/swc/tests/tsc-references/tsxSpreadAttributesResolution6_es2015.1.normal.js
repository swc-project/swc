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
// Error
let x = /*#__PURE__*/ React.createElement(TextComponent, {
    editable: true
});
const textProps = {
    editable: false
};
export { };

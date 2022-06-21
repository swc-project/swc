import _extends from "@swc/helpers/src/_extends.mjs";
// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
const React = require('react');
class Button extends React.Component {
    render() {
        let condition;
        if (condition) {
            return /*#__PURE__*/ React.createElement(InnerButton, _extends({}, this.props));
        } else {
            return /*#__PURE__*/ React.createElement(InnerButton, _extends({}, this.props), /*#__PURE__*/ React.createElement("div", null, "Hello World"));
        }
    }
}
class InnerButton extends React.Component {
    render() {
        return /*#__PURE__*/ React.createElement("button", null, "Hello");
    }
}
export { };

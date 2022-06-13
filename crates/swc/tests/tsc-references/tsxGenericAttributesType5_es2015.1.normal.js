import _extends from "@swc/helpers/src/_extends.mjs";
// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
const React = require('react');
class B1 extends React.Component {
    render() {
        return /*#__PURE__*/ React.createElement("div", null, "hi");
    }
}
class B extends React.Component {
    render() {
        return /*#__PURE__*/ React.createElement(B1, _extends({}, this.props, {
            x: "hi"
        }));
    }
}
export { };

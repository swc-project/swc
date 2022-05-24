import _extends from "@swc/helpers/lib/_extends.js";
// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
const React = require('react');
export function makeP(Ctor) {
    return class extends React.PureComponent {
        render() {
            return /*#__PURE__*/ React.createElement(Ctor, _extends({}, this.props));
        }
    };
}

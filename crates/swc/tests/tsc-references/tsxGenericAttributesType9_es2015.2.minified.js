import _extends from "@swc/helpers/src/_extends.mjs";
let React = require('react');
export function makeP(Ctor) {
    return class extends React.PureComponent {
        render() {
            return React.createElement(Ctor, _extends({}, this.props));
        }
    };
}

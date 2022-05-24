import _extends from "@swc/helpers/lib/_extends.js";
let React = require('react');
export function makeP(Ctor) {
    return class extends React.PureComponent {
        render() {
            return React.createElement(Ctor, _extends({}, this.props));
        }
    };
}

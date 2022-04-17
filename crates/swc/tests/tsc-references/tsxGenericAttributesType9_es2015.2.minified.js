import * as swcHelpers from "@swc/helpers";
let React = require('react');
export function makeP(Ctor) {
    return class extends React.PureComponent {
        render() {
            return React.createElement(Ctor, swcHelpers.extends({}, this.props));
        }
    };
}

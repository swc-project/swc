import * as swcHelpers from "@swc/helpers";
let React = require('react');
class B1 extends React.Component {
    render() {
        return React.createElement("div", null, "hi");
    }
}
class B extends React.Component {
    render() {
        return React.createElement(B1, swcHelpers.extends({}, this.props, {
            x: "hi"
        }));
    }
}

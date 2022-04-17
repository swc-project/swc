import * as swcHelpers from "@swc/helpers";
let React = require('react');
class Button extends React.Component {
    render() {
        return React.createElement(InnerButton, swcHelpers.extends({}, this.props), React.createElement("div", null, "Hello World"));
    }
}
class InnerButton extends React.Component {
    render() {
        return React.createElement("button", null, "Hello");
    }
}

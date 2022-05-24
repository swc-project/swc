import _extends from "@swc/helpers/lib/_extends.js";
let React = require('react');
class Button extends React.Component {
    render() {
        return React.createElement(InnerButton, _extends({}, this.props), React.createElement("div", null, "Hello World"));
    }
}
class InnerButton extends React.Component {
    render() {
        return React.createElement("button", null, "Hello");
    }
}

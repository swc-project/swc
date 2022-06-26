import _extends from "@swc/helpers/src/_extends.mjs";
let React = require('react');
class Button extends React.Component {
    render() {
        return React.createElement(InnerButton, _extends({}, this.props, {
            children: "hi"
        }), React.createElement("div", null, "Hello World"));
    }
}
class InnerButton extends React.Component {
    render() {
        return React.createElement("button", null, "Hello");
    }
}

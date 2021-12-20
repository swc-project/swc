function _extends() {
    return (_extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
}
const React = require("react");
class Button extends React.Component {
    render() {
        return React.createElement(InnerButton, _extends({
        }, this.props, {
            children: "hi"
        }), React.createElement("div", null, "Hello World"));
    }
}
class InnerButton extends React.Component {
    render() {
        return React.createElement("button", null, "Hello");
    }
}
export { };

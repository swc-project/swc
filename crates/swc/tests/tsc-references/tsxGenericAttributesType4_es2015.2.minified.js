import _extends from "@swc/helpers/lib/_extends.js";
let React = require('react');
class B1 extends React.Component {
    render() {
        return React.createElement("div", null, "hi");
    }
}
class B extends React.Component {
    render() {
        return React.createElement(B1, _extends({}, this.props, {
            x: "hi"
        }));
    }
}

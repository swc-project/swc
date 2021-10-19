const React = require("react");
class BigGreeter extends React.Component {
    render() {
        return React.createElement("div", null, "Default hi");
    }
}
React.createElement(BigGreeter, {
    prop1: "hello"
}), React.createElement(BigGreeter, {
    ref: (input)=>{
        this.textInput = input;
    }
}), React.createElement(BigGreeter, {
    "data-extra": "hi"
});
export { };

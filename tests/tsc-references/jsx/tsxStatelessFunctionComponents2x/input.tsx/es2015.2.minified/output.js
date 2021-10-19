const React = require("react");
function Greet(x) {
    return React.createElement("div", null, "Hello, ", x);
}
class BigGreeter extends React.Component {
    render() {
        return React.createElement("div", null);
    }
}
React.createElement(Greet, null), React.createElement(Greet, {
    key: "k"
}), React.createElement(Greet, {
    ref: "myRef"
}), React.createElement(BigGreeter, {
    ref: (x)=>x.greeting.substr(10)
}), React.createElement(BigGreeter, {
    ref: (x)=>x.greeting.subtr(10)
}), React.createElement(BigGreeter, {
    ref: (x)=>x.notARealProperty
}), React.createElement(BigGreeter, {
    key: 100
}), React.createElement("div", {
    ref: (x)=>x.innerText
}), React.createElement("div", {
    ref: (x)=>x.propertyNotOnHtmlDivElement
});
export { };

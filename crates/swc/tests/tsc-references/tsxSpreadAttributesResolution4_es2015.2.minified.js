import _extends from "@swc/helpers/lib/_extends.js";
let React = require('react');
class Poisoned extends React.Component {
    render() {
        return React.createElement("div", null, "Hello");
    }
}
_extends({}, {
    x: "hello world",
    y: 2
});
class EmptyProp extends React.Component {
    render() {
        return React.createElement("div", null, "Default hi");
    }
}
let j;
_extends({}, {}), _extends({}, j), _extends({}, {
    ref: (input)=>{
        this.textInput = input;
    }
}), _extends({}, {
    "data-prop": !0
});

import * as swcHelpers from "@swc/helpers";
const React = require("react");
class Poisoned extends React.Component {
    render() {
        return React.createElement("div", null, "Hello");
    }
}
React.createElement(Poisoned, swcHelpers.extends({}, {
    x: "hello world",
    y: 2
}));
class EmptyProp extends React.Component {
    render() {
        return React.createElement("div", null, "Default hi");
    }
}
let j;
React.createElement(EmptyProp, swcHelpers.extends({}, {})), React.createElement(EmptyProp, swcHelpers.extends({}, j)), React.createElement(EmptyProp, swcHelpers.extends({}, {
    ref: (input)=>{
        this.textInput = input;
    }
})), React.createElement(EmptyProp, {
    "data-prop": !0
}), React.createElement(EmptyProp, swcHelpers.extends({}, {
    "data-prop": !0
}));

import * as swcHelpers from "@swc/helpers";
let React = require('react');
class Poisoned extends React.Component {
    render() {
        return React.createElement("div", null, "Hello");
    }
}
swcHelpers.extends({}, {
    x: "hello world",
    y: 2
});
class EmptyProp extends React.Component {
    render() {
        return React.createElement("div", null, "Default hi");
    }
}
let j;
swcHelpers.extends({}, {}), swcHelpers.extends({}, j), swcHelpers.extends({}, {
    ref: (input)=>{
        this.textInput = input;
    }
}), swcHelpers.extends({}, {
    "data-prop": !0
});

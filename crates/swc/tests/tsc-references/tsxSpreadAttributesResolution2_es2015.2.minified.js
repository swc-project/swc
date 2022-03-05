import * as swcHelpers from "@swc/helpers";
const React = require("react");
class Poisoned extends React.Component {
    render() {
        return React.createElement("div", null, "Hello");
    }
}
React.createElement(Poisoned, swcHelpers.extends({}, {
    x: "ok",
    y: "2"
})), React.createElement(Poisoned, swcHelpers.extends({}, {})), React.createElement(Poisoned, null), React.createElement(Poisoned, {
    x: !0,
    y: !0
}), React.createElement(Poisoned, swcHelpers.extends({}, {
    x: 5,
    y: "2"
})), React.createElement(Poisoned, swcHelpers.extends({}, {
    x: 5,
    y: "2"
}, {
    X: "hi"
}));

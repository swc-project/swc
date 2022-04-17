import * as swcHelpers from "@swc/helpers";
let React = require('react');
class Poisoned extends React.Component {
    render() {
        return React.createElement("div", null, "Hello");
    }
}
swcHelpers.extends({}, {
    x: "ok",
    y: "2"
}), swcHelpers.extends({}, {}), swcHelpers.extends({}, {
    x: 5,
    y: "2"
}), swcHelpers.extends({}, {
    x: 5,
    y: "2"
}, {
    X: "hi"
});

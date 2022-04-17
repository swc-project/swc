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

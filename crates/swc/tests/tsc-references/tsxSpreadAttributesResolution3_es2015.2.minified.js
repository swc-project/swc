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

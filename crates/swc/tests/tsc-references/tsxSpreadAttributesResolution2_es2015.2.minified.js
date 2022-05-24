import _extends from "@swc/helpers/lib/_extends.js";
let React = require('react');
class Poisoned extends React.Component {
    render() {
        return React.createElement("div", null, "Hello");
    }
}
_extends({}, {
    x: "ok",
    y: "2"
}), _extends({}, {}), _extends({}, {
    x: 5,
    y: "2"
}), _extends({}, {
    x: 5,
    y: "2"
}, {
    X: "hi"
});

import _extends from "@swc/helpers/lib/_extends.js";
let React = require('react');
class Opt extends React.Component {
    render() {
        return React.createElement("div", null, "Hello");
    }
}
let obj1 = {
    x: 2
};
_extends({}, {}, {
    x: 3
}), _extends({}, obj1, {
    x: "Hi"
}), _extends({}, obj1, {
    x: 3
});

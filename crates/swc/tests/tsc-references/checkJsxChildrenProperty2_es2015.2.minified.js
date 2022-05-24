import _extends from "@swc/helpers/lib/_extends.js";
let React = require('react');
_extends({
    a: 10,
    b: "hi"
}, {
    children: "Random"
}), (name)=>React.createElement("div", null, " My name ", name, " ");

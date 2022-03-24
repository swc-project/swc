import * as swcHelpers from "@swc/helpers";
const React = require('react');
swcHelpers.extends({
    a: 10,
    b: "hi"
}, {
    children: "Random"
}), (name)=>React.createElement("div", null, " My name ", name, " ")
;

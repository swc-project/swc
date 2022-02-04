const React = require("react"), Tag = (x)=>React.createElement("div", null)
;
React.createElement(Tag, null), React.createElement(Tag, null), React.createElement(Tag, {
    children: React.createElement("div", null)
}), React.createElement(Tag, {
    key: "1"
}, React.createElement("div", null)), React.createElement(Tag, {
    key: "1"
}, React.createElement("div", null), React.createElement("div", null));
export { };

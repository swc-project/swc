const React = require("react");
var SFC2AndEmptyComp = function(prop) {
    return React.createElement("h1", null, "World");
};
React.createElement(function() {
    return React.createElement("div", null, "Hi");
}, {
    x: !0
}), React.createElement(SFC2AndEmptyComp, {
    x: "hi"
}), React.createElement(SFC2AndEmptyComp, null), React.createElement(SFC2AndEmptyComp, {
    "data-prop": !0
});
export { };

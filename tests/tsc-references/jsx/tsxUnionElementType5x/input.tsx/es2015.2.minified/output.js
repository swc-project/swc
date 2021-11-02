const React = require("react");
var EmptySFCComp = function() {
    return React.createElement("div", null, "hello");
};
React.createElement(EmptySFCComp, null), React.createElement(EmptySFCComp, {
    "data-prop": !0
}), React.createElement(function(prop) {
    return React.createElement("h1", null, "World");
}, {
    x: !0
});
export { };

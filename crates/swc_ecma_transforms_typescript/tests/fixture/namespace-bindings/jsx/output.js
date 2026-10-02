(function(N) {
    function Component() {
        return React.createElement("div", null);
    }
    N.Component = Component;
    Component();
})(N || (N = {}));
(function(N) {
    N.element = React.createElement(N.Component, null);
})(N || (N = {}));
console.log(N.element);
var N;

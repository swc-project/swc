function _extends() {
    return (_extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
}
var React = require("react"), props = {
    a: 1,
    b: 1
}, Foo = function(props1) {
    return React.createElement("div", null, props1.a);
};
React.createElement(Foo, _extends({
}, props)), React.createElement(Foo, _extends({
    d: 1
}, props)), React.createElement(Foo, _extends({
    a: 1
}, props)), React.createElement(Foo, _extends({
    a: 1,
    b: 2
}, props)), React.createElement(Foo, _extends({
    a: 1,
    d: 1
}, props, {
    d: 1
})), React.createElement(Foo, _extends({
    a: 1,
    d: 1
}, props, {
    a: 1,
    d: 1
}));
export { };

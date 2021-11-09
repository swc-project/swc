function _extends() {
    return (_extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
}
var defaultObj, React = require("react"), obj = {
    yy: 10,
    yy1: "hello"
}, obj1 = {
    yy: !0
};
React.createElement(OneThing, null), React.createElement(OneThing, _extends({
}, obj)), React.createElement(OneThing, _extends({
}, {
})), React.createElement(OneThing, _extends({
}, obj1, obj)), React.createElement(OneThing, _extends({
}, obj1, {
    yy: 42
}, {
    yy1: "hi"
})), React.createElement(OneThing, _extends({
}, obj1, {
    yy: 10000,
    yy1: "true"
})), React.createElement(OneThing, _extends({
}, defaultObj, {
    yy: !0
}, obj)), React.createElement(OneThing, {
    "ignore-prop": 100
}), React.createElement(OneThing, _extends({
}, {
    "ignore-prop": 200
})), React.createElement(OneThing, _extends({
}, {
    yy: 500,
    "ignore-prop": "hello"
}, {
    yy1: "boo"
}));
export { };

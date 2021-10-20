function _extends() {
    return (_extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
}
React.createElement("div", {
    text: 42
}), React.createElement("div", {
    width: "foo"
}), React.createElement("div", _extends({
}, {
    text: 100
})), React.createElement("span", {
    foo: "bar",
    bar: "foo"
});

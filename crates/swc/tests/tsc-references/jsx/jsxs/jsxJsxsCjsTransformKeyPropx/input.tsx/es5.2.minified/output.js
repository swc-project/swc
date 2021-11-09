function _extends() {
    return (_extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
}
var props = {
    answer: 42
};
React.createElement("div", _extends({
    key: "foo"
}, props), "text"), React.createElement("div", _extends({
}, props, {
    key: "bar"
}), "text");
export { };

function _extends() {
    return (_extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
}
React.createElement("test1", _extends({
}, {
    x: "foo"
})), React.createElement("test1", _extends({
}, {
    x: 32
})), React.createElement("test1", _extends({
}, {
    y: 32
})), React.createElement("test1", _extends({
}, {
    x: 32,
    y: 32
}, {
    x: "ok"
})), React.createElement("test1", _extends({
    x: "ok"
}, {
    x: 32,
    y: 32
})), React.createElement("test1", _extends({
}, {
    x: "ok",
    y: 32,
    extra: 100
})), React.createElement("test1", _extends({
    x: 32
}, {
    x: "foo"
}));

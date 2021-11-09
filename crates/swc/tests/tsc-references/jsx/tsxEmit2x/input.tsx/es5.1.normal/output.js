function _extends() {
    _extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends.apply(this, arguments);
}
var p1, p2, p3;
var spreads1 = /*#__PURE__*/ React.createElement("div", _extends({
}, p1), p2);
var spreads2 = /*#__PURE__*/ React.createElement("div", _extends({
}, p1), p2);
var spreads3 = /*#__PURE__*/ React.createElement("div", _extends({
    x: p3
}, p1), p2);
var spreads4 = /*#__PURE__*/ React.createElement("div", _extends({
}, p1, {
    x: p3
}), p2);
var spreads5 = /*#__PURE__*/ React.createElement("div", _extends({
    x: p2
}, p1, {
    y: p3
}), p2);

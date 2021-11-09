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
var p;
var openClosed1 = /*#__PURE__*/ React.createElement("div", null, blah);
// Should emit React.__spread({}, p, {x: 0})
var spread1 = /*#__PURE__*/ React.createElement("div", _extends({
}, p, {
    x: 0
}));

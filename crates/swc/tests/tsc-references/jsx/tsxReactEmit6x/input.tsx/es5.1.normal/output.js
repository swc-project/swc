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
//@filename: react-consumer.tsx
var M1;
(function(M) {
    var React;
    M.React = React;
})(M1 || (M1 = {
}));
(function(M) {
    // Should emit M.React.createElement
    //  and M.React.__spread
    var foo;
    var spread1 = /*#__PURE__*/ React.createElement("div", _extends({
        x: ""
    }, foo, {
        y: ""
    }));
    // Quotes
    var x = /*#__PURE__*/ React.createElement("div", null, "This \"quote\" thing");
})(M1 || (M1 = {
}));

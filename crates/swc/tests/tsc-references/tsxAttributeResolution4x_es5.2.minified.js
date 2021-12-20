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
    x: function(n) {
        return 0;
    }
})), React.createElement("test1", _extends({
}, {
    x: function(n) {
        return n.len;
    }
}));

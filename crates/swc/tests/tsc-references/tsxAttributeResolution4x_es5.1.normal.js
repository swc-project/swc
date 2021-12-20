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
// OK
/*#__PURE__*/ React.createElement("test1", _extends({
}, {
    x: function(n) {
        return 0;
    }
}));
// Error, no member 'len' on 'string'
/*#__PURE__*/ React.createElement("test1", _extends({
}, {
    x: function(n) {
        return n.len;
    }
}));

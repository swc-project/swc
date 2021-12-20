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
// Error, number is not assignable to string
/*#__PURE__*/ React.createElement("div", {
    text: 42
});
// Error, string is not assignable to number
/*#__PURE__*/ React.createElement("div", {
    width: 'foo'
});
// Error, number is not assignable to string
var attribs = {
    text: 100
};
/*#__PURE__*/ React.createElement("div", _extends({
}, attribs));
// No errors here
/*#__PURE__*/ React.createElement("span", {
    foo: "bar",
    bar: 'foo'
});

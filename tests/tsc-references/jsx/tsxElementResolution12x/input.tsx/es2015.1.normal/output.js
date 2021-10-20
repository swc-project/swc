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
var Obj1;
/*#__PURE__*/ React.createElement(Obj1, {
    x: 10
}); // OK
var Obj2;
/*#__PURE__*/ React.createElement(Obj2, {
    x: 10
}); // OK
var Obj3;
/*#__PURE__*/ React.createElement(Obj3, {
    x: 10
}); // Error
var attributes;
/*#__PURE__*/ React.createElement(Obj3, _extends({
}, attributes)); // Error
/*#__PURE__*/ React.createElement(Obj3, _extends({
}, {
})); // OK
var Obj4;
/*#__PURE__*/ React.createElement(Obj4, {
    x: 10
}); // OK
/*#__PURE__*/ React.createElement(Obj4, {
    x: '10'
}); // Error

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
var MyClass = // @noImplicitAny: true
// @noImplicitThis: true
/*#__PURE__*/ function() {
    "use strict";
    function MyClass() {
        _classCallCheck(this, MyClass);
    }
    _createClass(MyClass, [
        {
            key: "fn",
            value: function fn() {
                //type of 'this' in an object literal is the containing scope's this
                var t = {
                    x: this,
                    y: this.t
                };
                var t;
            }
        }
    ]);
    return MyClass;
}();
//type of 'this' in an object literal method is the type of the object literal
var obj = {
    f: function() {
        return this.spaaace;
    }
};
var obj;

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
var _class, _class1;
function getFoo1() {
    return /*#__PURE__*/ (function() {
        "use strict";
        function _class2() {
            _classCallCheck(this, _class2);
        }
        _createClass(_class2, null, [
            {
                key: "method1",
                value: function method1(arg) {
                    arg.numProp = 10;
                }
            },
            {
                key: "method2",
                value: function method2(arg) {
                    arg.strProp = "hello";
                }
            }
        ]);
        return _class2;
    })();
}
function getFoo2() {
    return _class = function _class2() {
        "use strict";
        _classCallCheck(this, _class2);
    }, _class.method1 = function(arg) {
        arg.numProp = 10;
    }, _class.method2 = function(arg) {
        arg.strProp = "hello";
    }, _class;
}
function getFoo3() {
    return _class1 = function _class2() {
        "use strict";
        _classCallCheck(this, _class2);
    }, _class1.method1 = function(arg) {
        arg.numProp = 10;
    }, _class1.method2 = function(arg) {
        arg.strProp = "hello";
    }, _class1;
}

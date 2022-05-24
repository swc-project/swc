import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
function getFoo1() {
    return /*#__PURE__*/ function() {
        "use strict";
        function _class() {
            _class_call_check(this, _class);
        }
        var _proto = _class.prototype;
        _proto.method1 = function method1(arg) {
            arg.numProp = 10;
        };
        _proto.method2 = function method2(arg) {
            arg.strProp = "hello";
        };
        return _class;
    }();
}
function getFoo2() {
    return function _class() {
        "use strict";
        _class_call_check(this, _class);
        this.method1 = function(arg) {
            arg.numProp = 10;
        };
        this.method2 = function(arg) {
            arg.strProp = "hello";
        };
    };
}
function getFoo3() {
    return function _class() {
        "use strict";
        _class_call_check(this, _class);
        this.method1 = function(arg) {
            arg.numProp = 10;
        };
        this.method2 = function(arg) {
            arg.strProp = "hello";
        };
    };
}

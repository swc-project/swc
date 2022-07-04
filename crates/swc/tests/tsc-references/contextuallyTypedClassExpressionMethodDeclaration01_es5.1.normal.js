import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function getFoo1() {
    return /*#__PURE__*/ function() {
        "use strict";
        function _class() {
            _class_call_check(this, _class);
        }
        _class.method1 = function method1(arg) {
            arg.numProp = 10;
        };
        _class.method2 = function method2(arg) {
            arg.strProp = "hello";
        };
        return _class;
    }();
}
function getFoo2() {
    var _class;
    return _class = function _class() {
        "use strict";
        _class_call_check(this, _class);
    }, _class.method1 = function(arg) {
        arg.numProp = 10;
    }, _class.method2 = function(arg) {
        arg.strProp = "hello";
    }, _class;
}
function getFoo3() {
    var _class;
    return _class = function _class() {
        "use strict";
        _class_call_check(this, _class);
    }, _class.method1 = function(arg) {
        arg.numProp = 10;
    }, _class.method2 = function(arg) {
        arg.strProp = "hello";
    }, _class;
}

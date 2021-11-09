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
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
    }
    _createClass(C, [
        {
            key: "X",
            get: function get() {
                return '';
            },
            set: function set(v) {
            } // ok
        },
        {
            key: "foo",
            value: function foo() {
                return '';
            }
        }
    ], [
        {
            key: "foo",
            value: function foo() {
            } // ok
        },
        {
            key: "X",
            get: function get() {
                return 1;
            }
        }
    ]);
    return C;
}();
var a;
// error
var b = {
    a: '',
    b: 1,
    c: function() {
    },
    "d": '',
    "e": 1,
    1: '',
    2: 1,
    "3.0": '',
    "4.0": 1,
    f: null,
    get X () {
        return '';
    },
    set X (v){
    },
    foo: function() {
        return '';
    }
};

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
    _createClass(C, null, [
        {
            key: "x",
            get: function get() {
                return 1;
            } // error
        }
    ]);
    return C;
}();
var D = /*#__PURE__*/ function() {
    "use strict";
    function D() {
        _classCallCheck(this, D);
    }
    _createClass(D, null, [
        {
            key: "x",
            set: function set(v) {
            } // error
        }
    ]);
    return D;
}();
var E = /*#__PURE__*/ function() {
    "use strict";
    function E() {
        _classCallCheck(this, E);
    }
    _createClass(E, null, [
        {
            key: "x",
            get: function get() {
                return 1;
            },
            set: function set(v) {
            }
        }
    ]);
    return E;
}();

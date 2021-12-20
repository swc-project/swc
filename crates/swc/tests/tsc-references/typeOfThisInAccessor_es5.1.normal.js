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
            key: "x",
            get: function get() {
                var r = this; // C
                return 1;
            }
        }
    ], [
        {
            key: "y",
            get: function get() {
                var r2 = this; // typeof C
                return 1;
            }
        }
    ]);
    return C;
}();
var D = /*#__PURE__*/ function() {
    "use strict";
    function D() {
        _classCallCheck(this, D);
    }
    _createClass(D, [
        {
            key: "x",
            get: function get() {
                var r = this; // D<T>
                return 1;
            }
        }
    ], [
        {
            key: "y",
            get: function get() {
                var r2 = this; // typeof D
                return 1;
            }
        }
    ]);
    return D;
}();
var x = {
    get a () {
        var r3 = this; // any
        return 1;
    }
};

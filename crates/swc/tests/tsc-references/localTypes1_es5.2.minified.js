function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _getPrototypeOf(o) {
    return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    }, _getPrototypeOf(o);
}
function _setPrototypeOf(o, p) {
    return _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        return o.__proto__ = p, o;
    }, _setPrototypeOf(o, p);
}
var A = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function A() {
        _classCallCheck(this, A), (E = E || (E = {}))[E.A = 0] = "A", E[E.B = 1] = "B", E[E.C = 2] = "C";
        var E, E, C = function() {
            _classCallCheck(this, C);
        };
    }
    return Constructor = A, protoProps = [
        {
            key: "m",
            value: function() {
                (E = E || (E = {}))[E.A = 0] = "A", E[E.B = 1] = "B", E[E.C = 2] = "C";
                var E, E, C = function() {
                    _classCallCheck(this, C);
                };
                return new C();
            }
        },
        {
            key: "p",
            get: function() {
                (E = E || (E = {}))[E.A = 0] = "A", E[E.B = 1] = "B", E[E.C = 2] = "C";
                var E, E, C = function() {
                    _classCallCheck(this, C);
                };
                return new C();
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), A;
}();

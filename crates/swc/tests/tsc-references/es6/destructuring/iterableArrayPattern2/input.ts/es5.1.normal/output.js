function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
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
function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
}
function _toArray(arr) {
    return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest();
}
var tmp = Symbol.iterator;
var SymbolIterator = //@target: ES6
/*#__PURE__*/ function() {
    "use strict";
    function SymbolIterator() {
        _classCallCheck(this, SymbolIterator);
    }
    _createClass(SymbolIterator, [
        {
            key: "next",
            value: function next() {
                return {
                    value: Symbol(),
                    done: false
                };
            }
        },
        {
            key: tmp,
            value: function value() {
                return this;
            }
        }
    ]);
    return SymbolIterator;
}();
var ref = _toArray(new SymbolIterator), a = ref[0], b = ref.slice(1);

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
var C = // @target: es5
// In the body of a get accessor with no return type annotation,
// if a matching set accessor exists and that set accessor has a parameter type annotation,
// return expressions are contextually typed by the type given in the set accessor's parameter type annotation.
/*#__PURE__*/ function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
    }
    _createClass(C, [
        {
            key: "X",
            get: function get() {
                return "string"; // Error; get contextual type by set accessor parameter type annotation
            },
            set: function set(x) {
            }
        },
        {
            key: "Y",
            get: function get() {
                return true;
            },
            set: function set(y) {
            }
        },
        {
            key: "W",
            get: function get() {
                return true;
            },
            set: function set(w) {
            }
        },
        {
            key: "Z",
            get: function get() {
                return 1;
            },
            set: function set(z) {
            }
        }
    ]);
    return C;
}();

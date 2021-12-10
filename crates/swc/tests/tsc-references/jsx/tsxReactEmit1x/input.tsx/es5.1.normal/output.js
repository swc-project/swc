function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
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
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
var p;
var selfClosed1 = /*#__PURE__*/ React.createElement("div", null);
var selfClosed2 = /*#__PURE__*/ React.createElement("div", {
    x: "1"
});
var selfClosed3 = /*#__PURE__*/ React.createElement("div", {
    x: "1"
});
var selfClosed4 = /*#__PURE__*/ React.createElement("div", {
    x: "1",
    y: "0"
});
var selfClosed5 = /*#__PURE__*/ React.createElement("div", {
    x: 0,
    y: "0"
});
var selfClosed6 = /*#__PURE__*/ React.createElement("div", {
    x: "1",
    y: "0"
});
var selfClosed7 = /*#__PURE__*/ React.createElement("div", {
    x: p,
    y: "p",
    b: true
});
var openClosed1 = /*#__PURE__*/ React.createElement("div", null);
var openClosed2 = /*#__PURE__*/ React.createElement("div", {
    n: "m"
}, "foo");
var openClosed3 = /*#__PURE__*/ React.createElement("div", {
    n: "m"
}, p);
var openClosed4 = /*#__PURE__*/ React.createElement("div", {
    n: "m"
}, p < p);
var openClosed5 = /*#__PURE__*/ React.createElement("div", {
    n: "m",
    b: true
}, p > p);
var SomeClass = /*#__PURE__*/ function() {
    "use strict";
    function SomeClass() {
        _classCallCheck(this, SomeClass);
    }
    _createClass(SomeClass, [
        {
            key: "f",
            value: function f() {
                var _this = this;
                var rewrites1 = /*#__PURE__*/ React.createElement("div", null, function() {
                    return _this;
                });
                var rewrites2 = /*#__PURE__*/ React.createElement("div", null, [
                    p
                ].concat(_toConsumableArray(p), [
                    p
                ]));
                var rewrites3 = /*#__PURE__*/ React.createElement("div", null, {
                    p: p
                });
                var rewrites4 = /*#__PURE__*/ React.createElement("div", {
                    a: function() {
                        return _this;
                    }
                });
                var rewrites5 = /*#__PURE__*/ React.createElement("div", {
                    a: [
                        p
                    ].concat(_toConsumableArray(p), [
                        p
                    ])
                });
                var rewrites6 = /*#__PURE__*/ React.createElement("div", {
                    a: {
                        p: p
                    }
                });
            }
        }
    ]);
    return SomeClass;
}();
var whitespace1 = /*#__PURE__*/ React.createElement("div", null, "      ");
var whitespace2 = /*#__PURE__*/ React.createElement("div", null, "  ", p, "    ");
var whitespace3 = /*#__PURE__*/ React.createElement("div", null, p);

function _arrayLikeToArray(arr, len) {
    (null == len || len > arr.length) && (len = arr.length);
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _toConsumableArray(arr) {
    return (function(arr) {
        if (Array.isArray(arr)) return _arrayLikeToArray(arr);
    })(arr) || (function(iter) {
        if ("undefined" != typeof Symbol && null != iter[Symbol.iterator] || null != iter["@@iterator"]) return Array.from(iter);
    })(arr) || _unsupportedIterableToArray(arr) || (function() {
        throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    })();
}
function _unsupportedIterableToArray(o, minLen) {
    if (o) {
        if ("string" == typeof o) return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if ("Object" === n && o.constructor && (n = o.constructor.name), "Map" === n || "Set" === n) return Array.from(n);
        if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }
}
React.createElement("div", null), React.createElement("div", {
    x: "1"
}), React.createElement("div", {
    x: "1"
}), React.createElement("div", {
    x: "1",
    y: "0"
}), React.createElement("div", {
    x: 0,
    y: "0"
}), React.createElement("div", {
    x: "1",
    y: "0"
}), React.createElement("div", {
    x: p,
    y: "p"
}), React.createElement("div", null), React.createElement("div", {
    n: "m"
}, "foo"), React.createElement("div", {
    n: "m"
}, p), React.createElement("div", {
    n: "m"
}, !1), React.createElement("div", {
    n: "m"
}, !1);
var p, SomeClass = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function SomeClass() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, SomeClass);
    }
    return Constructor = SomeClass, protoProps = [
        {
            key: "f",
            value: function() {
                var _this = this;
                React.createElement("div", null, function() {
                    return _this;
                }), React.createElement("div", null, [
                    p
                ].concat(_toConsumableArray(p), [
                    p
                ])), React.createElement("div", null, {
                    p: p
                }), React.createElement("div", {
                    a: function() {
                        return _this;
                    }
                }), React.createElement("div", {
                    a: [
                        p
                    ].concat(_toConsumableArray(p), [
                        p
                    ])
                }), React.createElement("div", {
                    a: {
                        p: p
                    }
                });
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), SomeClass;
}();
React.createElement("div", null, "      "), React.createElement("div", null, "  ", p, "    "), React.createElement("div", null, p);

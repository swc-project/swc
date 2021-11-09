function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _toConsumableArray(arr) {
    return (function(arr) {
        if (Array.isArray(arr)) {
            for(var i = 0, arr2 = new Array(arr.length); i < arr.length; i++)arr2[i] = arr[i];
            return arr2;
        }
    })(arr) || (function(iter) {
        if (Symbol.iterator in Object(iter) || "[object Arguments]" === Object.prototype.toString.call(iter)) return Array.from(iter);
    })(arr) || (function() {
        throw new TypeError("Invalid attempt to spread non-iterable instance");
    })();
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
                var _this = this, _this1 = this;
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
                        return _this1;
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

import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _to_consumable_array from "@swc/helpers/lib/_to_consumable_array.js";
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
        _class_call_check(this, SomeClass);
    }
    var _proto = SomeClass.prototype;
    _proto.f = function f() {
        var _this = this;
        var rewrites1 = /*#__PURE__*/ React.createElement("div", null, function() {
            return _this;
        });
        var rewrites2 = /*#__PURE__*/ React.createElement("div", null, [
            p
        ].concat(_to_consumable_array(p), [
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
            ].concat(_to_consumable_array(p), [
                p
            ])
        });
        var rewrites6 = /*#__PURE__*/ React.createElement("div", {
            a: {
                p: p
            }
        });
    };
    return SomeClass;
}();
var whitespace1 = /*#__PURE__*/ React.createElement("div", null, "      ");
var whitespace2 = /*#__PURE__*/ React.createElement("div", null, "  ", p, "    ");
var whitespace3 = /*#__PURE__*/ React.createElement("div", null, p);

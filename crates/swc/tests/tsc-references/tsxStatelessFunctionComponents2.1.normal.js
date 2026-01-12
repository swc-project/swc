//// [file.tsx]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
function Greet(x) {
    return /*#__PURE__*/ React.createElement("div", null, "Hello, ", x);
}
var BigGreeter = /*#__PURE__*/ function(_React_Component) {
    "use strict";
    _inherits(BigGreeter, _React_Component);
    function BigGreeter() {
        _class_call_check(this, BigGreeter);
        return _call_super(this, BigGreeter, arguments);
    }
    var _proto = BigGreeter.prototype;
    _proto.render = function render() {
        return /*#__PURE__*/ React.createElement("div", null);
    };
    return BigGreeter;
}(React.Component);
// OK
var a = /*#__PURE__*/ React.createElement(Greet, null);
// OK - always valid to specify 'key'
var b = /*#__PURE__*/ React.createElement(Greet, {
    key: "k"
});
// Error - not allowed to specify 'ref' on SFCs
var c = /*#__PURE__*/ React.createElement(Greet, {
    ref: "myRef"
});
// OK - ref is valid for classes
var d = /*#__PURE__*/ React.createElement(BigGreeter, {
    ref: function(x) {
        return x.greeting.substr(10);
    }
});
// Error ('subtr' not on string)
var e = /*#__PURE__*/ React.createElement(BigGreeter, {
    ref: function(x) {
        return x.greeting.subtr(10);
    }
});
// Error (ref callback is contextually typed)
var f = /*#__PURE__*/ React.createElement(BigGreeter, {
    ref: function(x) {
        return x.notARealProperty;
    }
});
// OK - key is always valid
var g = /*#__PURE__*/ React.createElement(BigGreeter, {
    key: 100
});
// OK - contextually typed intrinsic ref callback parameter
var h = /*#__PURE__*/ React.createElement("div", {
    ref: function(x) {
        return x.innerText;
    }
});
// Error - property not on ontextually typed intrinsic ref callback parameter
var i = /*#__PURE__*/ React.createElement("div", {
    ref: function(x) {
        return x.propertyNotOnHtmlDivElement;
    }
});
export { };

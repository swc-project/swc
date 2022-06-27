import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _extends from "@swc/helpers/src/_extends.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var _this = this;
// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
var React = require("react");
var Poisoned = /*#__PURE__*/ function(_Component) {
    "use strict";
    _inherits(Poisoned, _Component);
    var _super = _create_super(Poisoned);
    function Poisoned() {
        _class_call_check(this, Poisoned);
        return _super.apply(this, arguments);
    }
    var _proto = Poisoned.prototype;
    _proto.render = function render() {
        return /*#__PURE__*/ React.createElement("div", null, "Hello");
    };
    return Poisoned;
}(React.Component);
var obj = {
    x: "hello world",
    y: 2
};
// OK
var p = /*#__PURE__*/ React.createElement(Poisoned, _extends({}, obj));
var EmptyProp = /*#__PURE__*/ function(_Component) {
    "use strict";
    _inherits(EmptyProp, _Component);
    var _super = _create_super(EmptyProp);
    function EmptyProp() {
        _class_call_check(this, EmptyProp);
        return _super.apply(this, arguments);
    }
    var _proto = EmptyProp.prototype;
    _proto.render = function render() {
        return /*#__PURE__*/ React.createElement("div", null, "Default hi");
    };
    return EmptyProp;
}(React.Component);
// OK
var j;
var e1 = /*#__PURE__*/ React.createElement(EmptyProp, _extends({}, {}));
var e2 = /*#__PURE__*/ React.createElement(EmptyProp, _extends({}, j));
var e3 = /*#__PURE__*/ React.createElement(EmptyProp, _extends({}, {
    ref: function(input) {
        _this.textInput = input;
    }
}));
var e4 = /*#__PURE__*/ React.createElement(EmptyProp, {
    "data-prop": true
});
var e5 = /*#__PURE__*/ React.createElement(EmptyProp, _extends({}, {
    "data-prop": true
}));
export { };

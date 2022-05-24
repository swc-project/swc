import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _extends from "@swc/helpers/lib/_extends.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
var React = require("react");
var Opt = /*#__PURE__*/ function(_Component) {
    "use strict";
    _inherits(Opt, _Component);
    var _super = _create_super(Opt);
    function Opt() {
        _class_call_check(this, Opt);
        return _super.apply(this, arguments);
    }
    var _proto = Opt.prototype;
    _proto.render = function render() {
        return /*#__PURE__*/ React.createElement("div", null, "Hello");
    };
    return Opt;
}(React.Component);
var obj = {};
var obj1 = {
    x: 2
};
// OK
var p = /*#__PURE__*/ React.createElement(Opt, null);
var y = /*#__PURE__*/ React.createElement(Opt, _extends({}, obj));
var y1 = /*#__PURE__*/ React.createElement(Opt, _extends({}, obj1));
var y2 = /*#__PURE__*/ React.createElement(Opt, _extends({}, obj1, {
    y: true
}));
var y3 = /*#__PURE__*/ React.createElement(Opt, {
    x: 2
});
export { };

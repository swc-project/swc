import * as swcHelpers from "@swc/helpers";
// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
var React = require('react');
var Opt = /*#__PURE__*/ function(_Component) {
    "use strict";
    swcHelpers.inherits(Opt, _Component);
    var _super = swcHelpers.createSuper(Opt);
    function Opt() {
        swcHelpers.classCallCheck(this, Opt);
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
var y = /*#__PURE__*/ React.createElement(Opt, swcHelpers.extends({}, obj));
var y1 = /*#__PURE__*/ React.createElement(Opt, swcHelpers.extends({}, obj1));
var y2 = /*#__PURE__*/ React.createElement(Opt, swcHelpers.extends({}, obj1, {
    y: true
}));
var y3 = /*#__PURE__*/ React.createElement(Opt, {
    x: 2
});
export { };

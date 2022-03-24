import * as swcHelpers from "@swc/helpers";
var _this = this;
// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
var React = require("react");
var Poisoned = /*#__PURE__*/ function(_Component) {
    "use strict";
    swcHelpers.inherits(Poisoned, _Component);
    var _super = swcHelpers.createSuper(Poisoned);
    function Poisoned() {
        swcHelpers.classCallCheck(this, Poisoned);
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
var p = /*#__PURE__*/ React.createElement(Poisoned, swcHelpers.extends({}, obj));
var EmptyProp = /*#__PURE__*/ function(_Component) {
    "use strict";
    swcHelpers.inherits(EmptyProp, _Component);
    var _super = swcHelpers.createSuper(EmptyProp);
    function EmptyProp() {
        swcHelpers.classCallCheck(this, EmptyProp);
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
var e1 = /*#__PURE__*/ React.createElement(EmptyProp, swcHelpers.extends({}, {}));
var e2 = /*#__PURE__*/ React.createElement(EmptyProp, swcHelpers.extends({}, j));
var e3 = /*#__PURE__*/ React.createElement(EmptyProp, swcHelpers.extends({}, {
    ref: function(input) {
        _this.textInput = input;
    }
}));
var e4 = /*#__PURE__*/ React.createElement(EmptyProp, {
    "data-prop": true
});
var e5 = /*#__PURE__*/ React.createElement(EmptyProp, swcHelpers.extends({}, {
    "data-prop": true
}));
export { };

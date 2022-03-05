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
    swcHelpers.createClass(Opt, [
        {
            key: "render",
            value: function render() {
                return(/*#__PURE__*/ React.createElement("div", null, "Hello"));
            }
        }
    ]);
    return Opt;
}(React.Component);
var obj = {};
var obj1 = {
    x: 2
};
// Error
var y = /*#__PURE__*/ React.createElement(Opt, swcHelpers.extends({}, obj, {
    x: 3
}));
var y1 = /*#__PURE__*/ React.createElement(Opt, swcHelpers.extends({}, obj1, {
    x: "Hi"
}));
var y2 = /*#__PURE__*/ React.createElement(Opt, swcHelpers.extends({}, obj1, {
    x: 3
}));
var y3 = /*#__PURE__*/ React.createElement(Opt, {
    x: true
});
export { };

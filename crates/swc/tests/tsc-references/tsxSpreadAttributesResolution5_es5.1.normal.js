import * as swcHelpers from "@swc/helpers";
// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
var React = require('react');
var Poisoned = /*#__PURE__*/ function(_Component) {
    "use strict";
    swcHelpers.inherits(Poisoned, _Component);
    var _super = swcHelpers.createSuper(Poisoned);
    function Poisoned() {
        swcHelpers.classCallCheck(this, Poisoned);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(Poisoned, [
        {
            key: "render",
            value: function render() {
                return(/*#__PURE__*/ React.createElement("div", null, "Hello"));
            }
        }
    ]);
    return Poisoned;
}(React.Component);
var obj = {
    x: "hello world",
    y: 2
};
// Error as "obj" has type { x: string; y: number }
var p = /*#__PURE__*/ React.createElement(Poisoned, swcHelpers.extends({}, obj));
var EmptyProp = /*#__PURE__*/ function(_Component) {
    "use strict";
    swcHelpers.inherits(EmptyProp, _Component);
    var _super = swcHelpers.createSuper(EmptyProp);
    function EmptyProp() {
        swcHelpers.classCallCheck(this, EmptyProp);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(EmptyProp, [
        {
            key: "render",
            value: function render() {
                return(/*#__PURE__*/ React.createElement("div", null, "Default hi"));
            }
        }
    ]);
    return EmptyProp;
}(React.Component);
var o = {
    prop1: false
};
// Ok
var e = /*#__PURE__*/ React.createElement(EmptyProp, swcHelpers.extends({}, o));
export { };

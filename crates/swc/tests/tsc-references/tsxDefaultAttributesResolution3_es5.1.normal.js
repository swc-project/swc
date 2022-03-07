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
    var _proto = Poisoned.prototype;
    _proto.render = function render() {
        return(/*#__PURE__*/ React.createElement("div", null, "Hello"));
    };
    return Poisoned;
}(React.Component);
// Error
var p = /*#__PURE__*/ React.createElement(Poisoned, {
    x: true
});
export { };

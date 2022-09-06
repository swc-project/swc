//// [tsxAttributeResolution14.tsx]
define([
    "require"
], function(require) {
    "use strict";
});
//// [react.d.ts]
define([
    "require"
], function(require) {
    "use strict";
});
//// [file.tsx]
define([
    "require"
], function(require) {
    "use strict";
    function VerticalNavMenuItem(prop) {
        return /*#__PURE__*/ React.createElement("div", null, "props.primaryText");
    }
    function VerticalNav() {
        return /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement(VerticalNavMenuItem, {
            primaryText: 2
        }), "  // error", /*#__PURE__*/ React.createElement(VerticalNavMenuItem, {
            justRandomProp: 2,
            primaryText: "hello"
        }), "  // ok", /*#__PURE__*/ React.createElement(VerticalNavMenuItem, {
            justRandomProp1: true,
            primaryText: "hello"
        }), "  // error");
    }
});

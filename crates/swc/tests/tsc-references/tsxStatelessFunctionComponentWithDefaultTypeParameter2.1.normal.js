//// [file.tsx]
define([
    "require",
    "react"
], function(require, React) {
    "use strict";
    function MyComponent1(attr) {
        return /*#__PURE__*/ React.createElement("div", null, "attr.values");
    }
    // Error
    var i1 = /*#__PURE__*/ React.createElement(MyComponent1, {
        values: 5
    });
});

//// [file.tsx]
define([
    "require",
    "exports",
    "react"
], function(require, exports, _react) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function MyComponent1(attr) {
        return <div>attr.values</div>;
    }
    // Error
    var i1 = <MyComponent1 values={5}/>;
});

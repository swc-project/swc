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
    function MyComponent(attr) {
        return <div>attr.values</div>;
    }
    // OK
    var i = <MyComponent values/>; // We infer type arguments here
    var i1 = <MyComponent values="Hello"/>;
});

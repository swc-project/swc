//// [file.tsx]
define([
    "require",
    "exports",
    "react"
], function(require, exports, _react) {
    function MyComponent(attr) {
        return <div>attr.values</div>;
    }
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), <MyComponent values/>, <MyComponent values="Hello"/>;
});

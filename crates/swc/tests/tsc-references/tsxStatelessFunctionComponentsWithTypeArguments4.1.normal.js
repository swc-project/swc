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
    // Error
    function Baz(arg1, arg2) {
        var a0 = <OverloadComponent a={arg1.b}/>;
        var a2 = <OverloadComponent {...arg1} ignore-prop/>;
    // missing a
    }
});

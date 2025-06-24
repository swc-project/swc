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
    var Foo = function(props) {
        return undefined;
    };
    function Greet(x) {
        return undefined;
    }
    // Error
    var foo = <Foo/>;
    var G = <Greet/>;
});

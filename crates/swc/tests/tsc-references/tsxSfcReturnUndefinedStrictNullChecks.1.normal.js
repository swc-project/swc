//// [file.tsx]
define([
    "require",
    "react"
], function(require, React) {
    "use strict";
    var Foo = function Foo(props) {
        return undefined;
    };
    function Greet(x) {
        return undefined;
    }
    // Error
    var foo = /*#__PURE__*/ React.createElement(Foo, null);
    var G = /*#__PURE__*/ React.createElement(Greet, null);
});

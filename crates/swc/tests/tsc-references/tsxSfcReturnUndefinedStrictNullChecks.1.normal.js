//// [file.tsx]
define([
    "require"
], function(require) {
    "use strict";
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

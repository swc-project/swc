//// [file.tsx]
define([
    "require"
], function(require) {
    "use strict";
    // Error
    function Baz(arg1, arg2) {
        var a0 = <OverloadComponent a={arg1.b}/>;
        var a2 = <OverloadComponent {...arg1} ignore-prop/>;
    // missing a
    }
});

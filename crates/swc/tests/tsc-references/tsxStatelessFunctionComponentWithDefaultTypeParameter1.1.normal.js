//// [file.tsx]
define([
    "require"
], function(require) {
    "use strict";
    function MyComponent(attr) {
        return <div>attr.values</div>;
    }
    // OK
    var i = <MyComponent values/>; // We infer type arguments here
    var i1 = <MyComponent values="Hello"/>;
});

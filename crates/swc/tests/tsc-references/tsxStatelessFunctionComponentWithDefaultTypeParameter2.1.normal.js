//// [file.tsx]
define([
    "require"
], function(require) {
    "use strict";
    function MyComponent1(attr) {
        return <div>attr.values</div>;
    }
    // Error
    var i1 = <MyComponent1 values={5}/>;
});

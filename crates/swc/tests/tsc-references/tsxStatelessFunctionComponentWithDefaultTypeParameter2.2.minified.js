//// [file.tsx]
define([
    "require"
], function(require) {
    function MyComponent1(attr) {
        return <div>attr.values</div>;
    }
    <MyComponent1 values={5}/>;
});

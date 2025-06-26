//// [file.tsx]
define([
    "require"
], function(require) {
    function MyComponent(attr) {
        return <div>attr.values</div>;
    }
    <MyComponent values/>, <MyComponent values="Hello"/>;
});

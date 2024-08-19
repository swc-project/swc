import * as React from 'react';
export var FooNs;
(function(FooNs) {
    FooNs.Shared = ()=>'I\'m shared component';
    FooNs.Main = ()=>/*#__PURE__*/ React.createElement(FooNs.Shared, null);
})(FooNs || (FooNs = {}));

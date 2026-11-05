import * as React from 'react';
(function(FooNs) {
    FooNs.Shared = ()=>'I\'m shared component';
    FooNs.Main = ()=>React.createElement(FooNs.Shared, null);
})(FooNs || (FooNs = {}));
export var FooNs;

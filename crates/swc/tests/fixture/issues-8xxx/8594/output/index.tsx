import * as React from 'react';
export var FooNs;
(function(FooNs) {
    FooNs.Shared = ()=>'I\'m shared component';
    FooNs.Main = ()=>React.createElement(FooNs.Shared, null);
})(FooNs || (FooNs = {}));

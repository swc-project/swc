import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
(function(FooNs) {
    FooNs.Shared = ()=>'I\'m shared component';
    FooNs.Main = ()=>_jsx(FooNs.Shared, {});
})(FooNs || (FooNs = {}));
export var FooNs;

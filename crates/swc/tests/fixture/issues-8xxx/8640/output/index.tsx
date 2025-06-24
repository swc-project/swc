import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
(function(Ns) {
    Ns.Context = React.createContext();
    Ns.Component = ()=>_jsx(Ns.Context.Provider, {});
})(Ns || (Ns = {}));
export var Ns;

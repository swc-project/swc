import * as React from 'react';
(function(Ns) {
    Ns.Context = React.createContext();
    Ns.Component = ()=>React.createElement(Ns.Context.Provider, null);
})(Ns || (Ns = {}));
export var Ns;

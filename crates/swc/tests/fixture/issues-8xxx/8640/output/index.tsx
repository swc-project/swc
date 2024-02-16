import * as React from 'react';
export var Ns;
(function(Ns) {
    Ns.Context = React.createContext();
    Ns.Component = ()=>React.createElement(Ns.Context.Provider, null);
})(Ns || (Ns = {}));

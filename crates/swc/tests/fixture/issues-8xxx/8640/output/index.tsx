import * as React from 'react';
(function(Ns) {
    Ns.Context = React.createContext();
    Ns.Component = ()=>/*#__PURE__*/ React.createElement(Ns.Context.Provider, null);
})(Ns || (Ns = {}));
export var Ns;

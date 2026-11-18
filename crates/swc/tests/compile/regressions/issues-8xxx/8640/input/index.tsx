import * as React from 'react';

export namespace Ns {
    export const Context = React.createContext()
    export const Component = () => <Context.Provider />;
}
import * as React from 'react';

export namespace FooNs {
    export const Shared = () => 'I\'m shared component';
    export const Main = () => <Shared/>;
}
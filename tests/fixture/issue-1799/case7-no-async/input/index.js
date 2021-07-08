import React from 'react';

export default function Foo() {
    return call((e) => { await doSomething(); })
}

Foo.displayName = "Foo";

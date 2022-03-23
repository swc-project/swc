import React from 'react';

export default function Foo() {
    return call(async (e) => { await doSomething(); })
}

Foo.displayName = "Foo";

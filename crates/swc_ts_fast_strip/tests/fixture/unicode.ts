type 任意 = any;

function foo() {
    <任意>(void 1); throw new Error('foo');
}

foo();
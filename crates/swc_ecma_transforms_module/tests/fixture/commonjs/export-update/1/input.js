export let foo = 1n;

foo++;
export let bar = ++foo;

export let baz = bar--;

export { foo as foobar, baz as bazbar };

--bar;

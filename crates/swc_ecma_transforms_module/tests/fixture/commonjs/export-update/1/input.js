export let foo = 1n;

foo++;
export let bar = ++foo;

export let baz = bar--;
--bar;

function foo(o, n) {
    const t = o.get();
    return t.map(({ [n]: o }) => o);
}
console.log(foo({ get: () => [{ blah: 42 }] }, "blah"));

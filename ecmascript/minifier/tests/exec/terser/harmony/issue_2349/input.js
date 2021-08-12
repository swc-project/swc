function foo(boo, key) {
    const value = boo.get();
    return value.map(({ [key]: bar }) => bar);
}
console.log(foo({ get: () => [{ blah: 42 }] }, "blah"));

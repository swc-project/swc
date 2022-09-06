function n(n, o) {
    const t = n.get();
    return t.map(({ [o]: n }) => n);
}
console.log(n({ get: () => [{ blah: 42 }] }, "blah"));

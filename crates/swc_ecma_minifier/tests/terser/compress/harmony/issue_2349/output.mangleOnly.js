function n(n, t) {
    const o = n.get();
    return o.map(({ [t]: n })=>n);
}
console.log(n({
    get: ()=>[
            {
                blah: 42
            }
        ]
}, "blah"));

function t(t, n) {
    const e = t.get();
    return e.map(({ [n]: t  })=>t);
}
console.log(t({
    get: ()=>[
            {
                blah: 42
            }
        ]
}, "blah"));

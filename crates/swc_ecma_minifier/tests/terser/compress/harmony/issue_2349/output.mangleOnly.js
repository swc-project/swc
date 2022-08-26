function t(t, n) {
    const a = t.get();
    return a.map(({ [n]: t  })=>t);
}
console.log(t({
    get: ()=>[
            {
                blah: 42
            }
        ]
}, "blah"));

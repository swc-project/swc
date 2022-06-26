function a(a, b) {
    const c = a.get();
    return c.map(({ [b]: a  })=>a);
}
console.log(a({
    get: ()=>[
            {
                blah: 42
            }
        ]
}, "blah"));

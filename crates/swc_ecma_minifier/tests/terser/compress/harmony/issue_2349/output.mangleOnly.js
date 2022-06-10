function a(a, c) {
    const b = a.get();
    return b.map(({ [c]: a  })=>a);
}
console.log(a({
    get: ()=>[
            {
                blah: 42
            }
        ]
}, "blah"));

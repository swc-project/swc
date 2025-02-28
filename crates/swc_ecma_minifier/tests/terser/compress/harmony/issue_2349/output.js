function foo(o, t) {
    const n = o.get();
    return n.map(({ [t]: o })=>o);
}
console.log(foo({
    get: ()=>[
            {
                blah: 42
            }
        ]
}, "blah"));

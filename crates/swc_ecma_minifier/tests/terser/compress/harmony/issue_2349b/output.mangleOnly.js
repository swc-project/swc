function n(n, t) {
    const r = n.get();
    return r.map(function({ [t]: n  }) {
        return n;
    });
}
console.log(n({
    get: function() {
        return [
            {
                blah: 42
            }
        ];
    }
}, "blah"));

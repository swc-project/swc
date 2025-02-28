function n(n, o) {
    const t = n.get();
    return t.map(function({ [o]: n }) {
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

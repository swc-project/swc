function a(a, c) {
    const b = a.get();
    return b.map(function({ [c]: a  }) {
        return a;
    });
}
console.log(a({
    get: function() {
        return [
            {
                blah: 42
            }
        ];
    }
}, "blah"));

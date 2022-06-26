function a(a, b) {
    const c = a.get();
    return c.map(function({ [b]: a  }) {
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

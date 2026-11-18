v = ((a) => (b) => {
    const n = a.map((t) => {
        if (t) return ((e) => e.foo)(t);
    });
    return n;
})(r);

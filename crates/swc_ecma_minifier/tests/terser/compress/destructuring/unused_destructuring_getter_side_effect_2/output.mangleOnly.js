function a(a) {
    const { a: c , b: b  } = a;
    console.log(b);
}
a({
    a: 1,
    b: 2
});
a({
    get a () {
        var b = "side effect";
        console.log(b);
        return b;
    },
    b: 4
});

function a(a) {
    function b() {
        var { b: b , c: c  } = a;
        console.log(b, c);
    }
    b();
}
a({
    b: 2,
    c: 3
});

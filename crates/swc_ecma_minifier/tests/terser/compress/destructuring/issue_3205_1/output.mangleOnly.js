function a(b) {
    function a() {
        var { b: a , c: c  } = b;
        console.log(a, c);
    }
    a();
}
a({
    b: 2,
    c: 3
});

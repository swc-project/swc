function f() {
    try {
        a();
    } catch (e) {
        var b = 1;
    }
    console.log(b);
}

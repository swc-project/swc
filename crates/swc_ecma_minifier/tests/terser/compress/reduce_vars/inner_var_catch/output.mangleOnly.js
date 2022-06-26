function b() {
    try {
        a();
    } catch (b) {
        var c = 1;
    }
    console.log(c);
}

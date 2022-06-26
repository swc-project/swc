function a(a) {
    function b() {
        L: {
            console.log("PASS");
            break L;
        }
    }
    b();
}
a(0);

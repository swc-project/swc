function a(b) {
    function a() {
        L: {
            console.log("PASS");
            break L;
        }
    }
    a();
}
a(0);

function a() {
    function a() {
        try {
            throw 0;
        } catch (a) {
            console.log("PASS");
        }
    }
    a();
}
a();

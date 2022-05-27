function a(a) {
    function b() {
        throw "nope";
    }
    try {
        console.log("0" + b() ? "yes" : "no");
    } catch (c) {
        console.log(c);
    }
    console.log("0" + a ? "yes" : "no");
    console.log(a + "0" ? "Yes" : "No");
    console.log("" + a);
    console.log(a + "");
}
a();

function o(o) {
    function n() {
        throw "nope";
    }
    try {
        console.log("0" + n() ? "yes" : "no");
    } catch (g) {
        console.log(g);
    }
    console.log("0" + o ? "yes" : "no");
    console.log(o + "0" ? "Yes" : "No");
    console.log("" + o);
    console.log(o + "");
}
o();

function o(o) {
    function n() {
        throw "nope";
    }
    try {
        console.log("0" + n() ? "yes" : "no");
    } catch (o) {
        console.log(o);
    }
    console.log("0" + o ? "yes" : "no");
    console.log(o + "0" ? "Yes" : "No");
    console.log("" + o);
    console.log(o + "");
}
o();

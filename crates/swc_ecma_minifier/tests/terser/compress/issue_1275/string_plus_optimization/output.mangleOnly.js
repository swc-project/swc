function o(o) {
    function g() {
        throw "nope";
    }
    try {
        console.log("0" + g() ? "yes" : "no");
    } catch (l) {
        console.log(l);
    }
    console.log("0" + o ? "yes" : "no");
    console.log(o + "0" ? "Yes" : "No");
    console.log("" + o);
    console.log(o + "");
}
o();

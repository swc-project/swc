const x = "FOO";
const y = "BAR";
class X {
    [x] = "PASS";
    static [y];
}
if ("BAR" in X) {
    console.log(new X()[x]);
}

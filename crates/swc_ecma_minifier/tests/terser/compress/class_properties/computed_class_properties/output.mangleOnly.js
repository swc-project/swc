const a = "FOO";
const b = "BAR";
class c {
    [a] = "PASS";
    static [b];
}
if ("BAR" in c) {
    console.log(new c()[a]);
}

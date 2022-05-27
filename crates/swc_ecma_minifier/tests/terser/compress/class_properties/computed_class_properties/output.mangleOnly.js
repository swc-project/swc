const a = "FOO";
const c = "BAR";
class b {
    [a] = "PASS";
    static [c];
}
if ("BAR" in b) {
    console.log(new b()[a]);
}

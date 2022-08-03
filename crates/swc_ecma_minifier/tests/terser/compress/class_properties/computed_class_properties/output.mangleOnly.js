const s = "FOO";
const c = "BAR";
class n {
    [s] = "PASS";
    static [c];
}
if ("BAR" in n) {
    console.log(new n()[s]);
}

let s = 0;
class l {}
class c {
    prop = (s = s === 1 ? "PASS" : "FAIL");
}
class e {
    static prop = (s = s === 0 ? 1 : "FAIL");
}
new l();
new c();
new e();
console.log(s);

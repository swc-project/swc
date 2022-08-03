let s = 0;
class l {
}
class a {
    prop = (s = s === 1 ? "PASS" : "FAIL");
}
class c {
    static prop = (s = s === 0 ? 1 : "FAIL");
}
new l();
new a();
new c();
console.log(s);

let a = 0;
class b {
}
class c {
    prop = (a = a === 1 ? "PASS" : "FAIL");
}
class d {
    static prop = (a = a === 0 ? 1 : "FAIL");
}
new b();
new c();
new d();
console.log(a);

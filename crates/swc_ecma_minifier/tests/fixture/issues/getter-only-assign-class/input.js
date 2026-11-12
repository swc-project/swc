let count = 0;
class A {
    static assign() {
        ({ get count() { return count; } }).count = 1;
    }
}
try { A.assign(); console.log("FAIL"); } catch (e) { console.log(e instanceof TypeError); }
console.log(count);

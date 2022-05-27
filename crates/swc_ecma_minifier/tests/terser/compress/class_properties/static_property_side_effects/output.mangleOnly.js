let a = "FAIL";
class b {
    static [a = "PASS"];
}
console.log(a);
class c {
    static [console.log("PASS")];
}

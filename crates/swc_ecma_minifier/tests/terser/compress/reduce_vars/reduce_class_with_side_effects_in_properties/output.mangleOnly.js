let a = "";
class b {
    static _ = (a += "PA");
}
class c {
    static _ = (a += "SS");
}
global.something = [
    new c(),
    new b()
];
console.log(a);

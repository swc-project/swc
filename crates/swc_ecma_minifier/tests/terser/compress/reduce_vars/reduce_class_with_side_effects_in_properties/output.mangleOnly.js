let s = "";
class t {
    static _ = (s += "PA");
}
class a {
    static _ = (s += "SS");
}
global.something = [
    new a(),
    new t()
];
console.log(s);

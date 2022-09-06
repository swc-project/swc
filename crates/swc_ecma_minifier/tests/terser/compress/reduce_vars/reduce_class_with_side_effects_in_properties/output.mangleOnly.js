let s = "";
class l {
    static _ = (s += "PA");
}
class t {
    static _ = (s += "SS");
}
global.something = [new t(), new l()];
console.log(s);

let x = "";
class Y {
    static _ = (x += "PA");
}
class X {
    static _ = (x += "SS");
}
global.something = [new X(), new Y()];
console.log(x);

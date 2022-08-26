var o = {};
o.top = 1;
function r() {
    o["foo"] = "bar";
    o.color = "red";
    o.stuff = 2;
    x = {
        bar: 10,
        size: 7
    };
    o.size = 9;
}
function f() {
    o.foo = "bar";
    o["color"] = "red";
    x = {
        bar: 10,
        size: 7
    };
    o.size = 9;
    o.stuff = 3;
}

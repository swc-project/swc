var f = {};
f.top = 1;
function o() {
    f["foo"] = "bar";
    f.color = "red";
    f.stuff = 2;
    x = {
        bar: 10,
        size: 7
    };
    f.size = 9;
}
function i() {
    f.foo = "bar";
    f["color"] = "red";
    x = {
        bar: 10,
        size: 7
    };
    f.size = 9;
    f.stuff = 3;
}

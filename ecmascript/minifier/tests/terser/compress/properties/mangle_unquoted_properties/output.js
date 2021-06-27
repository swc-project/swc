var a = {};
a.a = 1;
function f1() {
    a["foo"] = "bar";
    a.color = "red";
    a.r = 2;
    x = { bar: 10, b: 7 };
    a.b = 9;
}
function f2() {
    a.foo = "bar";
    a["color"] = "red";
    x = { bar: 10, b: 7 };
    a.b = 9;
    a.r = 3;
}

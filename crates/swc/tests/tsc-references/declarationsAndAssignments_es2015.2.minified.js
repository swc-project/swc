var M, M1;
function f14([a = 1, [b = "hello", { x , y: c = !1  }]]) {
}
function f17({ a ="" , b =0 , c =!1  }) {
}
f14([
    2,
    [
        "abc",
        {
            x: 0,
            y: !0
        }
    ]
]), f14([
    2,
    [
        "abc",
        {
            x: 0
        }
    ]
]), f14([
    2,
    [
        "abc",
        {
            y: !1
        }
    ]
]), M1 = M || (M = {
}), [M1.a, M1.b] = [
    1,
    2
], f17({
}), f17({
    a: "hello"
}), f17({
    c: !0
}), f17({
    a: "hello",
    b: 1,
    c: !0
});

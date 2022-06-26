var M;
function f14([a = 1, [b = "hello", { x , y: c = !1  }]]) {}
function f17({ a ="" , b =0 , c =!1  }) {}
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
]), function(M) {
    [M.a, M.b] = [
        1,
        2
    ];
}(M || (M = {})), f17({}), f17({
    a: "hello"
}), f17({
    c: !0
}), f17({
    a: "hello",
    b: 1,
    c: !0
});

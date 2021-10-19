var Foo, Foo1;
function a1([a, b, [[c]]]) {
}
function b2(z = null, o = {
    x: 0,
    y: void 0
}) {
}
function c0({ z: { x , y: { j  }  }  }) {
}
function c1({ z  } = {
    z: 10
}) {
}
function c2({ z =10  }) {
}
function c5([a, b, [[c]]]) {
}
a1([
    1,
    2,
    [
        [
            "world"
        ]
    ]
]), a1([
    1,
    2,
    [
        [
            "world"
        ]
    ],
    3
]), b2("string", {
    x: 200,
    y: "string"
}), b2("string", {
    x: 200,
    y: !0
}), (Foo1 = Foo || (Foo = {
}))[Foo1.a = 0] = "a", c0({
    z: {
        x: 1,
        y: {
            j: "world"
        }
    }
}), c0({
    z: {
        x: "string",
        y: {
            j: !0
        }
    }
}), c1(), c1({
    z: 1
}), c2({
}), c2({
    z: 1
}), c5([
    1,
    2,
    [
        [
            "string"
        ]
    ]
]), c5([
    1,
    2,
    [
        [
            "string"
        ]
    ],
    !1,
    !0
]);

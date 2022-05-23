var Foo;
function a1([a, b, [[c]]]) {}
function b2(z = null, o = {
    x: 0,
    y: void 0
}) {}
function c0({ z: { x , y: { j  }  }  }) {}
function c1({ z  } = {
    z: 10
}) {}
function c2({ z =10  }) {}
function c5([a, b, [[c]]]) {}
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
]), function(z = [
    void 0,
    null
]) {}([
    1,
    2,
    3
]), b2("string", {
    x: 200,
    y: "string"
}), b2("string", {
    x: 200,
    y: !0
}), function([a, z, y] = [
    void 0,
    null,
    void 0
]) {}([
    "string",
    1,
    2
]), function([[a], b, [[c, d]]] = [
    [
        void 0
    ],
    void 0,
    [
        [
            void 0,
            void 0
        ]
    ]
]) {}([
    [
        "string"
    ],
    1,
    [
        [
            !0,
            !1
        ]
    ]
]), function(Foo) {
    Foo[Foo.a = 0] = "a";
}(Foo || (Foo = {})), c0({
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
}), c2({}), c2({
    z: 1
}), function({ b  } = {
    b: "hello"
}) {}({
    b: 1
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

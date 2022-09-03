//// [destructuringVariableDeclaration1ES6.ts]
var { a1 , a2  } = {
    a1: 10,
    a2: "world"
}, [a3, [[a4]], a5] = [
    1,
    [
        [
            "hello"
        ]
    ],
    !0
], { b1: { b11  } = {
    b11: "string"
}  } = {
    b1: {
        b11: "world"
    }
}, temp = {
    t1: !0,
    t2: "false"
}, [b2 = 3, b3 = !0, b4 = temp] = [
    3,
    !1,
    {
        t1: !1,
        t2: "hello"
    }
], [b5 = 3, b6 = !0, b7 = temp] = [
    void 0,
    void 0,
    void 0
], [...c1] = [
    1,
    2,
    3
], [...c2] = [
    1,
    2,
    3,
    "string"
], [d1, d2] = [
    1,
    "string"
], temp1 = [
    !0,
    !1,
    !0
], [d3, d4] = [
    1,
    "string",
    ...temp1
], { e: [e1, e2, e3 = {
    b1: 1000,
    b4: 200
}]  } = {
    e: [
        1,
        2,
        {
            b1: 4,
            b4: 0
        }
    ]
}, { f: [f1, f2, { f3: f4 , f5  }, ]  } = {
    f: [
        1,
        2,
        {
            f3: 4,
            f5: 0
        }
    ]
}, { g: { g1 =[
    void 0,
    null
]  }  } = {
    g: {
        g1: [
            1,
            2
        ]
    }
}, { h: { h1 =[
    void 0,
    null
]  }  } = {
    h: {
        h1: [
            1,
            2
        ]
    }
};

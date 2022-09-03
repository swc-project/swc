//// [recursiveTypeReferences1.ts]
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
var a0 = 1, a1 = [
    1,
    [
        2,
        3
    ],
    [
        4,
        [
            5,
            [
                6,
                7
            ]
        ]
    ]
], hypertextNode = [
    "div",
    {
        id: "parent"
    },
    [
        "div",
        {
            id: "first-child"
        },
        "I'm the first child"
    ],
    [
        "div",
        {
            id: "second-child"
        },
        "I'm the second child"
    ]
], data = {
    caption: "Test",
    location: {
        x: 10,
        y: 20
    },
    values: [
        !0,
        [
            10,
            20
        ],
        null
    ]
};
function f1(t1, t2, t3) {
    t1 = t2, t2 = t1 = t3, t2 = t3, t3 = t1, t3 = t2;
}
var b10 = 42, b11 = {
    value: 42
}, b12 = {
    value: {
        value: {
            value: 42
        }
    }
}, b20 = 42, b21 = {
    value: 42
}, b22 = {
    value: {
        value: {
            value: 42
        }
    }
};
flat([
    1,
    [
        2,
        [
            3
        ]
    ]
]), flat([
    [
        [
            0
        ]
    ]
]), flat([
    [
        [
            [
                [
                    [
                        [
                            [
                                [
                                    [
                                        [
                                            4
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ]
    ]
]), flat([
    1,
    "a",
    [
        2
    ]
]), flat([
    1,
    [
        2,
        "a"
    ]
]), flat([
    1,
    [
        "a"
    ]
]), flat1([
    1,
    [
        2,
        [
            3
        ]
    ]
]), flat1([
    [
        [
            0
        ]
    ]
]), flat1([
    1,
    "a",
    [
        2
    ]
]), flat1([
    1,
    [
        2,
        "a"
    ]
]), flat1([
    1,
    [
        "a"
    ]
]), flat2([
    1,
    [
        2,
        [
            3
        ]
    ]
]), flat2([
    [
        [
            0
        ]
    ]
]), flat2([
    1,
    "a",
    [
        2
    ]
]), flat2([
    1,
    [
        2,
        "a"
    ]
]), flat2([
    1,
    [
        "a"
    ]
]);
var x1 = foo1(ra1), x2 = foo2(ra2);
function parse(node) {
    var index = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [];
    return html("ul", node.map(function(param, i) {
        var _param = _sliced_to_array(param, 2), el = _param[0], children = _param[1], idx = _to_consumable_array(index).concat([
            i + 1
        ]);
        return html("li", [
            html("a", {
                href: "#".concat(el.id),
                rel: "noopener",
                "data-index": idx.join(".")
            }, el.textContent),
            children.length > 0 ? parse(children, idx) : frag()
        ]);
    }));
}
function cons(hs) {
    return hs.reduce(function(hss, h) {
        var _$hs = hss.pop();
        return 0 === _$hs.length || level(h) > level(_$hs[0]) ? concat(hss, [
            concat(_$hs, [
                h
            ])
        ]) : concat(hss, [
            _$hs,
            [
                h
            ]
        ]);
    }, [
        []
    ]).reduce(function(node, hs) {
        return 0 === hs.length ? node : concat(node, [
            [
                hs.shift(),
                cons(hs)
            ]
        ]);
    }, []);
}
function level(h) {
    return assert(isFinite(+h.tagName[1])), +h.tagName[1];
}

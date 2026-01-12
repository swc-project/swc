//// [recursiveTypeReferences1.ts]
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
var a0 = 1;
var a1 = [
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
];
var hypertextNode = [
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
];
var data = {
    caption: "Test",
    location: {
        x: 10,
        y: 20
    },
    values: [
        true,
        [
            10,
            20
        ],
        null
    ]
};
function f1(t1, t2, t3) {
    t1 = t2;
    t1 = t3;
    t2 = t1;
    t2 = t3;
    t3 = t1;
    t3 = t2;
}
var b10 = 42;
var b11 = {
    value: 42
};
var b12 = {
    value: {
        value: {
            value: 42
        }
    }
};
var b20 = 42; // Error
var b21 = {
    value: 42
};
var b22 = {
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
]); // number[]
flat([
    [
        [
            0
        ]
    ]
]); // number[]
flat([
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
]); // number[]
flat([
    1,
    'a',
    [
        2
    ]
]); // (string | number)[]
flat([
    1,
    [
        2,
        'a'
    ]
]); // (string | number)[]
flat([
    1,
    [
        'a'
    ]
]); // Error
flat1([
    1,
    [
        2,
        [
            3
        ]
    ]
]); // (number | number[])[]
flat1([
    [
        [
            0
        ]
    ]
]); // number[][]
flat1([
    1,
    'a',
    [
        2
    ]
]); // (string | number)[]
flat1([
    1,
    [
        2,
        'a'
    ]
]); // (string | number)[]
flat1([
    1,
    [
        'a'
    ]
]); // Error
flat2([
    1,
    [
        2,
        [
            3
        ]
    ]
]); // number[]
flat2([
    [
        [
            0
        ]
    ]
]); // number[]
flat2([
    1,
    'a',
    [
        2
    ]
]); // (string | number)[]
flat2([
    1,
    [
        2,
        'a'
    ]
]); // (string | number)[]
flat2([
    1,
    [
        'a'
    ]
]); // Error
var x1 = foo1(ra1); // Boom!
var x2 = foo2(ra2); // Boom!
function parse(node) {
    var index = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
    return html('ul', node.map(function(param, i) {
        var _param = _sliced_to_array(param, 2), el = _param[0], children = _param[1];
        var idx = _to_consumable_array(index).concat([
            i + 1
        ]);
        return html('li', [
            html('a', {
                href: "#".concat(el.id),
                rel: 'noopener',
                'data-index': idx.join('.')
            }, el.textContent),
            children.length > 0 ? parse(children, idx) : frag()
        ]);
    }));
}
function cons(hs) {
    return hs.reduce(function(hss, h) {
        var _$hs = hss.pop();
        return _$hs.length === 0 || level(h) > level(_$hs[0]) ? concat(hss, [
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
        return hs.length === 0 ? node : concat(node, [
            [
                hs.shift(),
                cons(hs)
            ]
        ]);
    }, []);
}
function level(h) {
    assert(isFinite(+h.tagName[1]));
    return +h.tagName[1];
}

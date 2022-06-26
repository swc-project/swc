const a0 = 1;
const a1 = [
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
const hypertextNode = [
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
let data = {
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
const b10 = 42;
const b11 = {
    value: 42
};
const b12 = {
    value: {
        value: {
            value: 42
        }
    }
};
const b20 = 42; // Error
const b21 = {
    value: 42
};
const b22 = {
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
let x1 = foo1(ra1); // Boom!
let x2 = foo2(ra2); // Boom!
function parse(node, index = []) {
    return html('ul', node.map(([el, children], i)=>{
        const idx = [
            ...index,
            i + 1
        ];
        return html('li', [
            html('a', {
                href: `#${el.id}`,
                rel: 'noopener',
                'data-index': idx.join('.')
            }, el.textContent),
            children.length > 0 ? parse(children, idx) : frag()
        ]);
    }));
}
function cons(hs) {
    return hs.reduce((hss, h)=>{
        const hs = hss.pop();
        return hs.length === 0 || level(h) > level(hs[0]) ? concat(hss, [
            concat(hs, [
                h
            ])
        ]) : concat(hss, [
            hs,
            [
                h
            ]
        ]);
    }, [
        []
    ]).reduce((node, hs)=>hs.length === 0 ? node : concat(node, [
            [
                hs.shift(),
                cons(hs)
            ]
        ]), []);
}
function level(h) {
    assert(isFinite(+h.tagName[1]));
    return +h.tagName[1];
}

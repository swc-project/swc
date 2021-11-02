function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
        for(var i = 0, arr2 = new Array(arr.length); i < arr.length; i++){
            arr2[i] = arr[i];
        }
        return arr2;
    }
}
function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}
function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;
    try {
        for(var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
}
function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}
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
function parse(node, param1) {
    var index = param1 === void 0 ? [] : param1;
    return html('ul', node.map(function(param, i) {
        var _param = _slicedToArray(param, 2), el = _param[0], children = _param[1];
        var idx = _toConsumableArray(index).concat([
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
function cons(hs1) {
    return hs1.reduce(function(hss, h) {
        var hs = hss.pop();
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

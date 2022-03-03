function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
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
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
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
function parse(node) {
    var index = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
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

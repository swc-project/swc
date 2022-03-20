import * as swcHelpers from "@swc/helpers";
// @allowJs: true
// @checkJs: true
// @noEmit: true
// @filename: index.js
// @target: esnext
/** @type {Array<[string, {x?:number, y?:number}]>} */ var arr = [
    [
        "a",
        {
            x: 1
        }
    ],
    [
        "b",
        {
            y: 2
        }
    ]
];
/** @return {Array<[string, {x?:number, y?:number}]>} */ function f() {
    return [
        [
            "a",
            {
                x: 1
            }
        ],
        [
            "b",
            {
                y: 2
            }
        ]
    ];
}
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    swcHelpers.createClass(C, [
        {
            key: "x",
            get: function get() {
                return [
                    [
                        "a",
                        {
                            x: 1
                        }
                    ],
                    [
                        "b",
                        {
                            y: 2
                        }
                    ]
                ];
            },
            set: /** @param {Array<[string, {x?:number, y?:number}]>} value */ function set(value) {}
        }
    ]);
    return C;
}();

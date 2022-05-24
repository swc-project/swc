import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
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
        _class_call_check(this, C);
    }
    _create_class(C, [
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

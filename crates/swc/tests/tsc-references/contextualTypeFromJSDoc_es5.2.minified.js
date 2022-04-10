import * as swcHelpers from "@swc/helpers";
var C = function() {
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return swcHelpers.createClass(C, [
        {
            key: "x",
            get: function() {
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
            set: function(value) {}
        }
    ]), C;
}();

//// [classStaticBlock24.ts]
System.register([
    "@swc/helpers/src/_class_call_check.mjs"
], function(_export, _context) {
    "use strict";
    var _class_call_check, C, __;
    return {
        setters: [
            function(_classCallCheck) {
                _class_call_check = _classCallCheck.default;
            }
        ],
        execute: function() {
            _export("C", C = function C() {
                "use strict";
                _class_call_check(void 0, C);
            });
            __ = {
                writable: true,
                value: function() {
                    C.x = 1;
                }()
            };
        }
    };
});

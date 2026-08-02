//// [classStaticBlock24.ts]
System.register([
    "@swc/helpers/_/_class_call_check"
], function(_export, _context) {
    "use strict";
    var C, _class_call_check;
    return _export("C", void 0), {
        setters: [
            function(_class_call_check_ns) {
                _class_call_check = _class_call_check_ns._;
            }
        ],
        execute: function() {
            _export("C", C = function C() {
                "use strict";
                _class_call_check(this, C);
            }), C.x = 1;
        }
    };
});

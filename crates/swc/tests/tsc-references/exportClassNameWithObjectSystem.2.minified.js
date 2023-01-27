//// [exportClassNameWithObjectSystem.ts]
System.register([
    "@swc/helpers/src/_class_call_check.mjs"
], function(_export, _context) {
    "use strict";
    var _class_call_check;
    return {
        setters: [
            function(_classCallCheck) {
                _class_call_check = _classCallCheck.default;
            }
        ],
        execute: function() {
            _export("Object", function Object() {
                "use strict";
                _class_call_check(this, Object);
            });
        }
    };
});

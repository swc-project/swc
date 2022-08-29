//// [exportClassNameWithObjectSystem.ts]
System.register([
    "@swc/helpers/src/_class_call_check.mjs"
], function(_export, _context) {
    "use strict";
    var _class_call_check, Object;
    return {
        setters: [
            function(_classCallCheck) {
                _class_call_check = _classCallCheck.default;
            }
        ],
        execute: function() {
            _export("Object", Object = function Object() {
                "use strict";
                _class_call_check(void 0, Object);
            });
        }
    };
});

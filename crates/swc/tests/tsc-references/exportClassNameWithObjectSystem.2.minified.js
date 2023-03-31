//// [exportClassNameWithObjectSystem.ts]
System.register([
    "@swc/helpers/src/_class_call_check.mjs"
], function(_export, _context) {
    "use strict";
    var _class_call_check;
    return {
        setters: [
            function(_class_call_check1) {
                _class_call_check = _class_call_check1.default;
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

//// [exportClassNameWithObjectSystem.ts]
System.register([
    "@swc/helpers/_/_class_call_check"
], function(_export, _context) {
    "use strict";
    var _class_call_check, Object;
    return {
        setters: [
            function(_class_call_check1) {
                _class_call_check = _class_call_check1._;
            }
        ],
        execute: function() {
            _export("Object", Object = function Object() {
                "use strict";
                _class_call_check(this, Object);
            });
        }
    };
});

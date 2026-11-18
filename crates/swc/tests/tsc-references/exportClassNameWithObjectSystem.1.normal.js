//// [exportClassNameWithObjectSystem.ts]
System.register([
    "@swc/helpers/_/_class_call_check"
], function(_export, _context) {
    "use strict";
    var Object, _class_call_check;
    _export("Object", void 0);
    return {
        setters: [
            function(_class_call_check_ns) {
                _class_call_check = _class_call_check_ns._;
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

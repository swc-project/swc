//// [exportClassNameWithObjectSystem.ts]
System.register([
    "@swc/helpers/_/_class_call_check"
], function(_export, _context) {
    var _class_call_check;
    return _export("Object", void 0), {
        setters: [
            function(_class_call_check_ns) {
                _class_call_check = _class_call_check_ns._;
            }
        ],
        execute: function() {
            _export("Object", function Object() {
                _class_call_check(this, Object);
            });
        }
    };
});

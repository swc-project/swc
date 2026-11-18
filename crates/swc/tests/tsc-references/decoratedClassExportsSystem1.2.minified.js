//// [a.ts]
System.register([
    "@swc/helpers/_/_ts_decorate"
], function(_export, _context) {
    var Testing123, _ts_decorate;
    return _export("Testing123", void 0), {
        setters: [
            function(_ts_decorate_ns) {
                _ts_decorate = _ts_decorate_ns._;
            }
        ],
        execute: function() {
            _export("Testing123", Testing123 = class {
            }), Testing123.prop1 = Testing123.prop0, _export("Testing123", Testing123 = _ts_decorate([
                Something({
                    v: ()=>Testing123
                })
            ], Testing123));
        }
    };
});

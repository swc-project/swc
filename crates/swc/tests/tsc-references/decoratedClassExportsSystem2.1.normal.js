//// [a.ts]
System.register([
    "@swc/helpers/_/_ts_decorate"
], function(_export, _context) {
    "use strict";
    var _ts_decorate, Testing123;
    _export("Testing123", void 0);
    return {
        setters: [
            function(_ts_decorate1) {
                _ts_decorate = _ts_decorate1._;
            }
        ],
        execute: function() {
            _export("Testing123", Testing123 = class Testing123 {
            });
            _export("Testing123", Testing123 = _ts_decorate([
                Something({
                    v: ()=>Testing123
                })
            ], Testing123));
        }
    };
});

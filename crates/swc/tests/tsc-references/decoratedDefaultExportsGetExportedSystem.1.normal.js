//// [a.ts]
System.register([
    "@swc/helpers/src/_ts_decorate.mjs"
], function(_export, _context) {
    "use strict";
    var _ts_decorate, decorator, Foo;
    return {
        setters: [
            function(_tsDecorate) {
                _ts_decorate = _tsDecorate.default;
            }
        ],
        execute: function() {
            _export("default", Foo = class Foo {
            });
            _export("default", Foo = _ts_decorate([
                decorator
            ], Foo));
        }
    };
});
//// [b.ts]
System.register([
    "@swc/helpers/src/_ts_decorate.mjs"
], function(_export, _context) {
    "use strict";
    var _ts_decorate, decorator, _class;
    return {
        setters: [
            function(_tsDecorate) {
                _ts_decorate = _tsDecorate.default;
            }
        ],
        execute: function() {
            _export("default", _class = class _class {
            });
            _export("default", _class = _ts_decorate([
                decorator
            ], _class));
        }
    };
});

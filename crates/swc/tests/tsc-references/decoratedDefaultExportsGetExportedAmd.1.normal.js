//// [a.ts]
define([
    "require",
    "exports",
    "@swc/helpers/src/_ts_decorate.mjs"
], function(require, exports, _tsDecorate) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "default", {
        enumerable: true,
        get: ()=>Foo
    });
    _tsDecorate = _tsDecorate.default;
    var decorator;
    let Foo = class Foo {
    };
    Foo = _tsDecorate([
        decorator
    ], Foo);
});
//// [b.ts]
define([
    "require",
    "exports",
    "@swc/helpers/src/_ts_decorate.mjs"
], function(require, exports, _tsDecorate) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "default", {
        enumerable: true,
        get: ()=>_class
    });
    _tsDecorate = _tsDecorate.default;
    var decorator;
    let _class = class _class {
    };
    _class = _tsDecorate([
        decorator
    ], _class);
});

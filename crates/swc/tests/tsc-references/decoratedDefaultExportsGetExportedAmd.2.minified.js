//// [a.ts]
define([
    "require",
    "exports",
    "@swc/helpers/src/_ts_decorate.mjs"
], function(require, exports, _tsDecorate) {
    "use strict";
    var decorator;
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    Object.defineProperty(exports, "default", {
        enumerable: !0,
        get: ()=>Foo
    });
    _tsDecorate = _tsDecorate.default;
    let Foo = class {
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
    var decorator;
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    Object.defineProperty(exports, "default", {
        enumerable: !0,
        get: ()=>_class
    });
    _tsDecorate = _tsDecorate.default;
    let _class = class {
    };
    _class = _tsDecorate([
        decorator
    ], _class);
});

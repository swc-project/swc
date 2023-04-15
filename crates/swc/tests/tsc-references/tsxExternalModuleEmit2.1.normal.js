//// [tsxExternalModuleEmit2.tsx]
"use strict";
//// [modules.d.ts]
"use strict";
//// [app.tsx]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _interop_require_default = require("@swc/helpers/_/_interop_require_default");
var _mod = /*#__PURE__*/ _interop_require_default._(require("mod"));
// Should see mod_1['default'] in emit here
/*#__PURE__*/ React.createElement(Foo, {
    handler: _mod.default
});
// Should see mod_1['default'] in emit here
/*#__PURE__*/ React.createElement(Foo, _mod.default);

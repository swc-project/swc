//// [tsxReactEmit5.tsx]
"use strict";
//// [file.tsx]
"use strict";
//// [test.d.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "React", {
    enumerable: true,
    get: function() {
        return React;
    }
});
var React;
//// [react-consumer.tsx]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _extends = require("@swc/helpers/lib/_extends.js").default;
var _test = require("./test");
// Should emit test_1.React.createElement
//  and React.__spread
var foo;
var spread1 = /*#__PURE__*/ _test.React.createElement("div", _extends({
    x: ""
}, foo, {
    y: ""
}));

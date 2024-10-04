//// [tsxReactEmit6.tsx]
"use strict";
//// [file.tsx]
"use strict";
//// [react-consumer.tsx]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _object_spread = require("@swc/helpers/_/_object_spread");
var _object_spread_props = require("@swc/helpers/_/_object_spread_props");
(function(M) {})(M || (M = {}));
(function(M) {
    // Should emit M.React.createElement
    //  and M.React.__spread
    var foo;
    var spread1 = /*#__PURE__*/ React.createElement("div", _object_spread_props._(_object_spread._({
        x: ""
    }, foo), {
        y: ""
    }));
    // Quotes
    var x = /*#__PURE__*/ React.createElement("div", null, 'This "quote" thing');
})(M || (M = {}));
var M;

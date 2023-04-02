//// [tsxReactEmit6.tsx]
"use strict";
//// [file.tsx]
"use strict";
//// [react-consumer.tsx]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _object_spread = require("@swc/helpers/lib/_object_spread.js").default;
var _object_spread_props = require("@swc/helpers/lib/_object_spread_props.js").default;
var M;
(function(M) {
    var React1;
    M.React = React1;
})(M || (M = {}));
(function(M) {
    // Should emit M.React.createElement
    //  and M.React.__spread
    var foo;
    var spread1 = /*#__PURE__*/ React.createElement("div", _object_spread_props(_object_spread({
        x: ""
    }, foo), {
        y: ""
    }));
    // Quotes
    var x = /*#__PURE__*/ React.createElement("div", null, 'This "quote" thing');
})(M || (M = {}));

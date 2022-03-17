import * as swcHelpers from "@swc/helpers";
//@filename: react-consumer.tsx
var M;
(function(M1) {
    var React;
    M1.React = React;
})(M || (M = {}));
(function(M) {
    // Should emit M.React.createElement
    //  and M.React.__spread
    var foo;
    var spread1 = /*#__PURE__*/ React.createElement("div", swcHelpers.extends({
        x: ""
    }, foo, {
        y: ""
    }));
    // Quotes
    var x = /*#__PURE__*/ React.createElement("div", null, 'This "quote" thing');
})(M || (M = {}));

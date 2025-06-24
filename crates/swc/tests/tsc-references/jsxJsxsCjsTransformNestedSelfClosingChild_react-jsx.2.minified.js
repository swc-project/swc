//// [jsxJsxsCjsTransformNestedSelfClosingChild.tsx]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _jsxruntime = require("react/jsx-runtime");
console.log((0, _jsxruntime.jsx)("div", {
    children: (0, _jsxruntime.jsx)("div", {})
})), console.log((0, _jsxruntime.jsxs)("div", {
    children: [
        (0, _jsxruntime.jsx)("div", {}),
        (0, _jsxruntime.jsx)("div", {})
    ]
})), console.log((0, _jsxruntime.jsx)("div", {
    children: [
        1,
        2
    ].map(function(i) {
        return (0, _jsxruntime.jsx)("div", {
            children: i
        }, i);
    })
}));

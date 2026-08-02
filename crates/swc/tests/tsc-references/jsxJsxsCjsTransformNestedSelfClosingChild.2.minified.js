//// [jsxJsxsCjsTransformNestedSelfClosingChild.tsx]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), console.log(React.createElement("div", null, React.createElement("div", null))), console.log(React.createElement("div", null, React.createElement("div", null), React.createElement("div", null))), console.log(React.createElement("div", null, [
    1,
    2
].map(function(i) {
    return React.createElement("div", {
        key: i
    }, i);
})));

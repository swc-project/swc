// Newline in quoted JSX attribute value should be escaped, not collapsed to space
// https://github.com/swc-project/swc/issues/11550
const hello = /*#__PURE__*/ React.createElement("div", {
    "data-anything": "bruh\nbruh"
}, "hello");

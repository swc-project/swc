// Multiple literal line breaks inside quoted JSX attribute strings should stay intact.
const hello = /*#__PURE__*/ React.createElement("div", {
    "data-anything": "line1\n\n    line2\nline3"
}, "hello");

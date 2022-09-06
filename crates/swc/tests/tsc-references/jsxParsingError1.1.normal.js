//// [jsxParsingError1.tsx]
//// [file.tsx]
// This should be a parse error
var class1 = "foo";
var class2 = "bar";
var elem = /*#__PURE__*/ React.createElement("div", {
    className: (class1, class2)
});

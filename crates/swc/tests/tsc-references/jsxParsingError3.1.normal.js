//// [jsxParsingError3.tsx]
//// [file.tsx]
//// [Error1.tsx]
var x1 = /*#__PURE__*/ React.createElement("div", null, "}");
//// [Error2.tsx]
var x2 = /*#__PURE__*/ React.createElement("div", null, ">");
//// [Error3.tsx]
var x3 = /*#__PURE__*/ React.createElement("div", null, "foo", "}");
//// [Error4.tsx]
var x4 = /*#__PURE__*/ React.createElement("div", null, "foo", ">");
//// [Error5.tsx]
var x5 = /*#__PURE__*/ React.createElement("div", null, "}", "foo");
//// [Error6.tsx]
var x6 = /*#__PURE__*/ React.createElement("div", null, ">", "foo");

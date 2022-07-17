//@filename: file.tsx
//@jsx: react
// THIS FILE HAS TEST-SIGNIFICANT LEADING/TRAILING
// WHITESPACE, DO NOT RUN 'FORMAT DOCUMENT' ON IT
var p = 0;
// Emit "   "
/*#__PURE__*/ React.createElement("div", null, "   ");
// Emit "  ", p, "   "
/*#__PURE__*/ React.createElement("div", null, "  ", p, "    ");
// Emit only p
/*#__PURE__*/ React.createElement("div", null, p);
// Emit only p
/*#__PURE__*/ React.createElement("div", null, p);
// Emit "  3"
/*#__PURE__*/ React.createElement("div", null, "  3");
// Emit "  3  "
/*#__PURE__*/ React.createElement("div", null, "  3  ");
// Emit "3"
/*#__PURE__*/ React.createElement("div", null, "3");
// Emit no args
/*#__PURE__*/ React.createElement("div", null);
// Emit "foo bar"
/*#__PURE__*/ React.createElement("div", null, "foo bar");
// Emit "hello\\ world"
/*#__PURE__*/ React.createElement("div", null, "hello\\ world");
// Emit "  a b  c d  "
/*#__PURE__*/ React.createElement("div", null, "  a b  c d  ");

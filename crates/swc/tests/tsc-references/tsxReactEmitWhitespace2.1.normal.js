//// [file.tsx]
// Emit ' word' in the last string
/*#__PURE__*/ React.createElement("div", null, "word ", /*#__PURE__*/ React.createElement("code", null, "code"), " word");
// Same here
/*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("code", null, "code"), " word");
// And here
/*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("code", null), " word");

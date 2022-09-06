//// [file.tsx]
/*#__PURE__*/ React.createElement(React.Fragment, null); // no whitespace
/*#__PURE__*/ React.createElement(React.Fragment, null); // lots of whitespace
/*#__PURE__*/ React.createElement(React.Fragment, null); // comments in the tags
/*#__PURE__*/ React.createElement(React.Fragment, null, "hi"); // text inside
/*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("span", null, "hi"), /*#__PURE__*/ React.createElement("div", null, "bye")); // children
/*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("span", null, "1"), /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("span", null, "2.1"), /*#__PURE__*/ React.createElement("span", null, "2.2")), /*#__PURE__*/ React.createElement("span", null, "3")); // nested fragments
/*#__PURE__*/ React.createElement(React.Fragment, null, "#"); // # would cause scanning error if not in jsxtext

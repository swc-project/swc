//// [file.tsx]
/*#__PURE__*/ React.createElement("div", null, "// Not Comment");
/*#__PURE__*/ React.createElement("div", null, "// Not Comment", "// Another not Comment");
/*#__PURE__*/ React.createElement("div", null, "// Not Comment", //Comment just Fine
"Hi", "// Another not Comment");
/*#__PURE__*/ React.createElement("div", null, "/* Not Comment */", //Comment just Fine
"Hi");
export { };

//// [inlineJsxAndJsxFragPragmaOverridesCompilerOptions.tsx]
//// [react.d.ts]
export { };
//// [preact.d.ts]
export { };
//// [snabbdom.d.ts]
export { };
//// [reacty.tsx]
/*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("span", null));
export { };
//// [preacty.tsx]
/*#__PURE__*/ h(Frag, null, /*#__PURE__*/ h("div", null));
/**
 * @jsx h
 * @jsxFrag Frag
 */ export { };
//// [snabbdomy.tsx]
/*#__PURE__*/ h(React.Fragment, null, /*#__PURE__*/ h("div", null));
/**
 * @jsx h
 * @jsxfrag null
 */ export { };
//// [mix-n-match.tsx]
/*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("span", null));
export { };

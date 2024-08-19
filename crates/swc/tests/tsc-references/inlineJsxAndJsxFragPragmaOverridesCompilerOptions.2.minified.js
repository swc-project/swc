//// [inlineJsxAndJsxFragPragmaOverridesCompilerOptions.tsx]
//// [react.d.ts]
export { };
//// [preact.d.ts]
export { };
//// [snabbdom.d.ts]
export { };
//// [reacty.tsx]
/*#__PURE__*/ React.Fragment;
export { };
//// [preacty.tsx]
import { h, Frag } from "./preact";
//// [snabbdomy.tsx]
import { h } from "./snabbdom";
/*#__PURE__*/ React.Fragment;
//// [mix-n-match.tsx]
import { h } from "./preact";
import { Fragment } from "./react";

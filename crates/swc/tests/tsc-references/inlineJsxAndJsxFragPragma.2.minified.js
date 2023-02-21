//// [renderer.d.ts]
export { };
//// [preacty.tsx]
import { h, Fragment } from "./renderer";
//// [snabbdomy.tsx]
import { jsx } from "./renderer";
React.Fragment;
//// [preacty-only-fragment.tsx]
import { h, Fragment } from "./renderer";
//// [snabbdomy-only-fragment.tsx]
import { jsx } from "./renderer";
React.Fragment;
//// [preacty-only-fragment-no-jsx.tsx]
import { Fragment } from "./renderer";
//// [snabbdomy-only-fragment-no-jsx.tsx]
import "./renderer";
React.Fragment;
//// [preacty-no-fragment.tsx]
import { h } from "./renderer";
//// [snabbdomy-no-fragment.tsx]
import { jsx } from "./renderer";
//// [preacty-only-component.tsx]
import { h } from "./renderer";

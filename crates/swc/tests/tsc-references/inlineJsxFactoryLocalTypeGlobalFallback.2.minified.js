//// [renderer.d.ts]
export { };
//// [renderer2.d.ts]
export { };
//// [component.tsx]
/** @jsx predom */ import { predom } from "./renderer2";
export default /*#__PURE__*/ predom("h", null);
//// [index.tsx]
/** @jsx dom */ import { dom } from "./renderer";
import prerendered from "./component";
 // Expect assignability error here

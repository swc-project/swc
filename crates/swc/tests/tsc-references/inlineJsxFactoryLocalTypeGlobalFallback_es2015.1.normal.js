// @jsx: react
// @filename: renderer.d.ts
// @filename: component.tsx
/** @jsx predom */ import { predom } from "./renderer2";
import prerendered from "./component";
export default /*#__PURE__*/ predom("h", null);
let elem = prerendered;
elem = /*#__PURE__*/ predom("h", null); // Expect assignability error here

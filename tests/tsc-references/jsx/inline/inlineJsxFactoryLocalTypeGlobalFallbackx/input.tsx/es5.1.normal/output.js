// @filename: component.tsx
/** @jsx predom */ import { predom } from "./renderer2";
import prerendered from "./component";
export default /*#__PURE__*/ predom("h", null);
var elem = prerendered;
elem = /*#__PURE__*/ predom("h", null); // Expect assignability error here

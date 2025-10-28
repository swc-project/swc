//// [renderer.d.ts]
export { };
//// [renderer2.d.ts]
export { };
//// [component.tsx]
export default /*#__PURE__*/ React.createElement("h", null);
//// [index.tsx]
import prerendered from "./component";
var elem = prerendered;
elem = /*#__PURE__*/ React.createElement("h", null); // Expect assignability error here

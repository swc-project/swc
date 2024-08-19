//// [renderer.d.ts]
export { };
//// [renderer2.d.ts]
export { };
//// [component.tsx]
import { predom } from "./renderer2";
export default /*#__PURE__*/ predom("h", null);
//// [index.tsx]
import { dom } from "./renderer";
import prerendered from "./component";

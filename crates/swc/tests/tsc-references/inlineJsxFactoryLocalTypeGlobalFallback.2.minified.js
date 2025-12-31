//// [renderer.d.ts]
export { };
//// [renderer2.d.ts]
export var predom;
//// [component.tsx]
import { predom } from "./renderer2";
export default predom("h", null);
//// [index.tsx]
import "./renderer";
import "./component";

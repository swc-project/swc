//// [renderer.d.ts]
//// [renderer2.d.ts]
var JSX;
predom || (predom = {}), JSX || (JSX = {});
export var predom;
//// [component.tsx]
import { predom } from "./renderer2";
export default predom("h", null);
//// [index.tsx]
import "./renderer";
import "./component";

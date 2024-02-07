//// [exportAsNamespace5.ts]
//// [three.d.ts]
export { };
//// [two.d.ts]
import * as _default from "./three";
export { _default as default };
//// [one.ts]
import ns from "./two";
ns.Named;

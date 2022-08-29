//// [declarations.d.ts]
//// [reExportX.ts]
export { x } from "jquery";
//// [reExportAll.ts]
export * from "jquery";
//// [reExportUser.ts]
import { x } from "./reExportX";
import * as $ from "./reExportAll";
// '$' is not callable, it is an object.
x($);

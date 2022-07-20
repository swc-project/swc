// @Filename: declarations.d.ts
// @Filename: reExportX.ts
export { x } from "jquery";
// @Filename: reExportAll.ts
export * from "jquery";
// @Filename: reExportUser.ts
import { x } from "./reExportX";
import * as $ from "./reExportAll";
// '$' is not callable, it is an object.
x($);

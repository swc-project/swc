// @Filename: declarations.d.ts
// @Filename: reExportUser.ts
import { x } from "./reExportX";
import * as $ from "./reExportAll";
// @Filename: reExportX.ts
export { x } from "jquery";
// @Filename: reExportAll.ts
export * from "jquery";
// '$' is not callable, it is an object.
x($);

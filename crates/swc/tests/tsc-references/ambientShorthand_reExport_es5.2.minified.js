export { x } from "jquery";
export * from "jquery";
import { x } from "./reExportX";
import * as $ from "./reExportAll";
x($);

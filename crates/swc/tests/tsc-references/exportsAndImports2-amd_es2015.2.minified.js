export var x = "x";
export var y = "y";
export { x as y, y as x } from "./t1";
import { x, y } from "./t1";
export { x as y, y as x };

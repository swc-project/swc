import { instanceof as x } from "./dep";
// Second import is required, otherwise the value is inlined instead of
// being put in an invalid local variable.
import * as y from "./dep";

console.log(x, y);
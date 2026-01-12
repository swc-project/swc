//// [usage.ts]
import { Something } from "./prelude";
export var myValue = Something.of("abc");
//// [Something.ts]
export { };
//// [prelude.ts]
import * as _Something from "./Something";
export { _Something as Something };

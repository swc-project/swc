//// [exportAsNamespace_nonExistent.ts]
import * as _ns from './nonexistent'; // Error
export { _ns as ns };

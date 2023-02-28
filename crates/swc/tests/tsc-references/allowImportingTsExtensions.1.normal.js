//// [allowImportingTsExtensions.ts]
//// [/ts.ts]
export { };
//// [/tsx.tsx]
export { };
//// [/dts.d.ts]
export { };
//// [/b.ts]
import "./ts.js";
import "./ts.ts";
import "./tsx.js";
import "./tsx.jsx";
import "./tsx.ts";
import "./tsx.tsx";
import "./dts.js";
import "./dts.ts";
//// [/c.ts]
import "./thisfiledoesnotexist.ts";

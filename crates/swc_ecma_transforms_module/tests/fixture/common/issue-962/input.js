import root from "./_root.js";
import stubFalse from "./stubFalse.js";

var freeExports = typeof exports == "object" && exports && !exports.nodeType &&
    exports;
var freeModule = freeExports && typeof module == "object" && module &&
    !module.nodeType && module;

var moduleExports = freeModule && freeModule.exports === freeExports;

var Buffer = moduleExports ? root.Buffer : undefined;

var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

var isBuffer = nativeIsBuffer || stubFalse;

export default isBuffer;

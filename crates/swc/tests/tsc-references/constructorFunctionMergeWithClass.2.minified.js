//// [constructorFunctionMergeWithClass.ts]
//// [file1.js]
new function() {
    this.otherProp = 0;
}();
//// [file2.js]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";

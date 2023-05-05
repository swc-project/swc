//// [constructorFunctionMergeWithClass.ts]
//// [file1.js]
new function() {
    this.otherProp = 0;
}();
//// [file2.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";

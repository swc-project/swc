//// [constructorFunctionMergeWithClass.ts]
//// [file1.js]
new function() {
    this.otherProp = 0;
}();
//// [file2.js]
import "@swc/helpers/_/_class_call_check";

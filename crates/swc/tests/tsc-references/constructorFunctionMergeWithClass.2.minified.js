//// [constructorFunctionMergeWithClass.ts]
//// [file1.js]
new function() {
    this.otherProp = 0;
}();
//// [file2.js]

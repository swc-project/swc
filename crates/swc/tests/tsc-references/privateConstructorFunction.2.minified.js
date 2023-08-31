//// [privateConstructorFunction.js]
new // make sure not to crash when parent's a block rather than a source file or some other
// symbol-having node.
/** @private */ function() {
    this.x = 1;
}();

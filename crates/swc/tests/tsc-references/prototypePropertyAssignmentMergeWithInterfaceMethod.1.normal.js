//// [lovefield-ts.d.ts]
// bug #27352, crashes from github.com/google/lovefield
//// [lovefield.js]
lf.Transaction = function() {};
/**
 * @param {!Array<!lf.schema.Table>} scope
 * @return {!IThenable}
 */ lf.Transaction.prototype.begin = function(scope) {};

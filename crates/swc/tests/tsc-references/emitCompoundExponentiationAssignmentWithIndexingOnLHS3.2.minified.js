//// [emitCompoundExponentiationAssignmentWithIndexingOnLHS3.ts]
var object = {
    _0: 2,
    get 0 () {
        return this._0;
    },
    set 0 (x){
        this._0 = x;
    }
}, ref = object[0];
object[0] = Math.pow(ref, object[0]);
var ref1 = object[0], ref2 = object[0];
object[0] = Math.pow(ref2, object[0] = Math.pow(ref1, 2));
var ref3 = object[0];
object[0] = Math.pow(ref3, Math.pow(object[0], 2));

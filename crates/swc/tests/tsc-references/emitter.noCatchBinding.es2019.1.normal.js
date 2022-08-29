//// [emitter.noCatchBinding.es2019.ts]
function f() {
    try {} catch  {}
    try {} catch  {
        try {} catch  {}
    }
    try {} catch  {} finally{}
}

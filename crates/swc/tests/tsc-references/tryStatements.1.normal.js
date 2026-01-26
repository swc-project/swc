//// [tryStatements.ts]
function fn() {
    try {} catch (unused) {}
    try {} catch (unused) {
        try {} catch (unused) {
            try {} catch (unused) {}
        }
        try {} catch (unused) {}
    }
    try {} catch (x) {
        var x;
    }
    try {} finally{}
    try {} catch (unused) {} finally{}
    try {} catch (z) {} finally{}
}

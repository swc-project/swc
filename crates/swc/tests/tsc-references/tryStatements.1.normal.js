//// [tryStatements.ts]
function fn() {
    try {} catch (e) {}
    try {} catch (e) {
        try {} catch (e) {
            try {} catch (e) {}
        }
        try {} catch (e) {}
    }
    try {} catch (x) {
        var x;
    }
    try {} finally{}
    try {} catch (e) {} finally{}
    try {} catch (z) {} finally{}
}

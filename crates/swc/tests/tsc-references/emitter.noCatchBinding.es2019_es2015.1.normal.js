// @target: es2019
function f() {
    try {} catch (e) {}
    try {} catch (e1) {
        try {} catch (e2) {}
    }
    try {} catch (e3) {} finally{}
}

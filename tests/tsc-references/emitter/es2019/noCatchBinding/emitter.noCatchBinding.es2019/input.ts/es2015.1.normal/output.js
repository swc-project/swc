// @target: es2019
function f() {
    try {
    } catch (e) {
    }
    try {
    } catch (e1) {
        try {
        } catch (e) {
        }
    }
    try {
    } catch (e2) {
    } finally{
    }
}

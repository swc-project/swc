// @strictNullChecks: true
// @declaration: true
function f1(x, y) {
    let obj;
    obj = x;
    obj = y;
}
function f2(x, y) {
    let obj;
    obj = x;
    obj = y;
}
function f3(x) {
    x = {
    };
}
// Repro from #13747
class Form {
    constructor(){
        this.values = {
        };
    }
}

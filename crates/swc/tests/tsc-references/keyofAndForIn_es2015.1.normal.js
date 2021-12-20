// @declaration: true
// Repro from #12513
function f1(obj, k) {
    const b = k in obj;
    let k1;
    for(k1 in obj){
        let x1 = obj[k1];
    }
    for(let k2 in obj){
        let x2 = obj[k2];
    }
}
function f2(obj, k) {
    const b = k in obj;
    let k1;
    for(k1 in obj){
        let x1 = obj[k1];
    }
    for(let k2 in obj){
        let x2 = obj[k2];
    }
}
function f3(obj, k) {
    const b = k in obj;
    let k1;
    for(k1 in obj){
        let x1 = obj[k1];
    }
    for(let k2 in obj){
        let x2 = obj[k2];
    }
}

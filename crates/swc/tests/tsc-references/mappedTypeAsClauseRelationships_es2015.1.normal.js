function fun(val) {
    let x = val; // Ok
    let y = val; // Error
}
function fun2(val) {
    let x = val; // Ok
    let y = val; // Ok
    let z = val; // Error
    let w = val; // Error
}

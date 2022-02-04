// @strictNullChecks: true
let zero = 0;
let one = 1;
let two = 2;
let oneOrTwo = 1;
function f1(x) {
    switch(x){
        case zero:
            x;
            break;
        case one:
            x;
            break;
        case two:
            x;
            break;
        default:
            x;
    }
}
function f2(x) {
    switch(x){
        case zero:
            x;
            break;
        case oneOrTwo:
            x;
            break;
        default:
            x;
    }
}
function f3(x) {
    if (x) {
        x;
    } else {
        x;
    }
}
function f4(x) {
    switch(x){
        case 0:
            x;
            break;
        case 1:
            x;
            break;
        case "abc":
        case "def":
            x;
            break;
        case null:
            x;
            break;
        case undefined:
            x;
            break;
        default:
            x;
    }
}
function f5(x) {
    switch(x){
        case "abc":
            x;
            break;
        case 0:
        case 1:
            x;
            break;
        case true:
            x;
            break;
        case "hello":
        case 123:
            x;
            break;
        default:
            x;
    }
}

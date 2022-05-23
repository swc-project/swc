var a = 100, b = 10;
function f() {
    switch(--b){
        default:
        case false:
            break;
        case b--:
            a--;
        case a++:
    }
}
f();
console.log(a, b);

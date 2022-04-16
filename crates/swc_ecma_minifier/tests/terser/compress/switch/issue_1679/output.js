var a = 100, b = 10;
function f() {
    switch(--b){
        default:
        case false:
        case b--:
            a--;
            break;
        case a++:
    }
}
f();
console.log(a, b);

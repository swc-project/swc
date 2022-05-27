var a = 100, b = 10;
function c() {
    switch(--b){
        default:
        case !function a() {}:
            break;
        case b--:
            switch(0){
                default:
                case a--:
            }
            break;
        case a++:
            break;
    }
}
c();
console.log(a, b);

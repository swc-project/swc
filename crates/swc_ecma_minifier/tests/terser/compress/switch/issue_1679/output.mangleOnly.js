var a = 100, e = 10;
function c() {
    switch(--e){
        default:
        case !function a() {}:
            break;
        case e--:
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
console.log(a, e);

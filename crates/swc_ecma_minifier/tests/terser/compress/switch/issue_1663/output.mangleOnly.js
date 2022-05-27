var a = 100, b = 10;
function c() {
    switch(1){
        case 1:
            b = a++;
            return ++b;
        default:
            var b;
    }
}
c();
console.log(a, b);

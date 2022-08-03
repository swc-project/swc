var a = 100, r = 10;
function t() {
    switch(1){
        case 1:
            r = a++;
            return ++r;
        default:
            var r;
    }
}
t();
console.log(a, r);

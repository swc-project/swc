var b = 1;
var a = {
    get 42 () {
        return b;
    },
    set 42 (c){
        b = c;
    }
};
console.log(a[42], (a[42] = 2), a[42]);

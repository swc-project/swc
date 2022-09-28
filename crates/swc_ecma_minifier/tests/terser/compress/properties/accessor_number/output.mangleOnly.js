var e = 1;
var r = {
    get 42 () {
        return e;
    },
    set 42 (c){
        e = c;
    }
};
console.log(r[42], (r[42] = 2), r[42]);

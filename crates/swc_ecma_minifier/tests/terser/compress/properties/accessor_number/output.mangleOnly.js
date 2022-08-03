var r = 1;
var e = {
    get 42 () {
        return r;
    },
    set 42 (c){
        r = c;
    }
};
console.log(e[42], (e[42] = 2), e[42]);

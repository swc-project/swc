var r = 1;
var e = {
    get true () {
        return r;
    },
    set false (c){
        r = c;
    }
};
console.log(e.true, (e.false = 2), e.true);

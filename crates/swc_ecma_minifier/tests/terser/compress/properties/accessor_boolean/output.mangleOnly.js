var e = 1;
var r = {
    get true () {
        return e;
    },
    set false (c){
        e = c;
    }
};
console.log(r.true, (r.false = 2), r.true);

var b = 1;
var a = {
    get true () {
        return b;
    },
    set false (c){
        b = c;
    }
};
console.log(a.true, (a.false = 2), a.true);

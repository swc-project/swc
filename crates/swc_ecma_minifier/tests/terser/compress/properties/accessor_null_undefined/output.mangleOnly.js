var n = 1;
var e = {
    get null () {
        return n;
    },
    set undefined (c){
        n = c;
    }
};
console.log(e.null, (e.undefined = 2), e.null);

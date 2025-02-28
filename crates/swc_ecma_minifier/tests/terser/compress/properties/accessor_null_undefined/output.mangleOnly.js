var e = 1;
var n = {
    get null () {
        return e;
    },
    set undefined (c){
        e = c;
    }
};
console.log(n.null, (n.undefined = 2), n.null);

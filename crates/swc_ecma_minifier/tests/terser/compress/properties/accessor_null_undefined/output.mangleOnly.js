var b = 1;
var a = {
    get null () {
        return b;
    },
    set undefined (c){
        b = c;
    }
};
console.log(a.null, (a.undefined = 2), a.null);

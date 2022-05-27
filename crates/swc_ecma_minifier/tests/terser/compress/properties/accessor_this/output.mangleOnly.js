var b = 1;
var a = {
    get this () {
        return b;
    },
    set this (c){
        b = c;
    }
};
console.log(a.this, (a.this = 2), a.this);

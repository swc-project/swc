var a = 1;
var b = {
    get this () {
        return a;
    },
    set this (c){
        a = c;
    }
};
console.log(b.this, (b.this = 2), b.this);

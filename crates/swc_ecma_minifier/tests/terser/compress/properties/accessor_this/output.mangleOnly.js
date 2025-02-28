var s = 1;
var t = {
    get this () {
        return s;
    },
    set this (c){
        s = c;
    }
};
console.log(t.this, (t.this = 2), t.this);

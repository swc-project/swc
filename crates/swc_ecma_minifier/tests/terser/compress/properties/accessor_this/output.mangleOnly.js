var t = 1;
var s = {
    get this () {
        return t;
    },
    set this (c){
        t = c;
    }
};
console.log(s.this, (s.this = 2), s.this);

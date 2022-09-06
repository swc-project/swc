var t = 1;
var s = {
    get this() {
        return t;
    },
    set this(s) {
        t = s;
    },
};
console.log(s.this, (s.this = 2), s.this);

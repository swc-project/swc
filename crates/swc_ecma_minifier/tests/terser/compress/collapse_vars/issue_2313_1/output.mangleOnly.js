var a = 0, b = 0;
var d = {
    get c () {
        a++;
        return 42;
    },
    set c (c){
        b++;
    },
    d: function() {
        this.c++;
        if (this.c) console.log(a, b);
    }
};
d.d();

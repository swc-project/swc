var e = 0, i = 0;
var t = {
    get c () {
        e++;
        return 42;
    },
    set c (c){
        i++;
    },
    d: function() {
        this.c++;
        if (this.c) console.log(e, i);
    }
};
t.d();

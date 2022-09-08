var t = 0, e = 0;
var i = {
    get c () {
        t++;
        return 42;
    },
    set c (c){
        e++;
    },
    d: function() {
        this.c++;
        if (this.c) console.log(t, e);
    }
};
i.d();

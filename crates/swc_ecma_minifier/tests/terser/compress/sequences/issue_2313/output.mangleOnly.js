var t = 0, i = 0;
var r = {
    get c () {
        t++;
        return 42;
    },
    set c (c){
        i++;
    },
    d: function() {
        this.c++;
        if (this.c) console.log(t, i);
    }
};
r.d();

var o = 1;
var c = {
    get c () {
        console.log(o);
    }
};
c.c;

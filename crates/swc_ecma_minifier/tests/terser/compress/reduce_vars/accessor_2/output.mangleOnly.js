var a = 1;
var c = {
    get c () {
        console.log(a);
    }
};
c.c;

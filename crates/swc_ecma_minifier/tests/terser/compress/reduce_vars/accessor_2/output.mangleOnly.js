var a = 1;
var b = {
    get c () {
        console.log(a);
    }
};
b.c;

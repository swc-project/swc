var c = 1;
var o = {
    get c() {
        console.log(c);
    },
};
o.c;

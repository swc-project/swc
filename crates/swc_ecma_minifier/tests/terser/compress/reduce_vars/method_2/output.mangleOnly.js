var a = 1;
var b = class {
    c() {
        console.log(a);
    }
};
new b().c();

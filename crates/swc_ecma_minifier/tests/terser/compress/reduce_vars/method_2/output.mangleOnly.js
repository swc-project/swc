var a = 1;
var c = class {
    c() {
        console.log(a);
    }
};
new c().c();

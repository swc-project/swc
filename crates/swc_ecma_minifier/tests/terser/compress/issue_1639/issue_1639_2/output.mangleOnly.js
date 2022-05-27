var a = 100, b = 10;
function c() {
    if ((++a, false)) if (a) if (++a) ;
}
c();
console.log(a, b);

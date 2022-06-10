var a = 100, b = 10;
function c() {
    var a = (a--, delete a && --b);
}
c();
console.log(a, b);

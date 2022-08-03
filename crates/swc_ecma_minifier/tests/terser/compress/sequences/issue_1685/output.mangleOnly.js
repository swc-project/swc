var e = 100, $ = 10;
function a() {
    var e = (e--, delete e && --$);
}
a();
console.log(e, $);

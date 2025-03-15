var c = 0;
!function a() {
    a && c++;
    var a = 0;
    0 && c++;
}();
console.log(c);

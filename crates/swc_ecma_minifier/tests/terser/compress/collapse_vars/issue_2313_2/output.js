var c = 0;
!function a() {
    a1 && c++;
    var a1 = 0;
    a1 && c++;
}();
console.log(c);

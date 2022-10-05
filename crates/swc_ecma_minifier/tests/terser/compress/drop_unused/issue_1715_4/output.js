var a = 1;
!function() {
    try {
        x();
    } catch (a) {
        var a;
    }
}();
console.log(a);

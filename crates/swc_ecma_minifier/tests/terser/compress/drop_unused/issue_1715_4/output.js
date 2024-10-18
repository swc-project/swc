var a = 1;
!function() {
    try {
        x();
    } catch (a) {}
}();
console.log(a);

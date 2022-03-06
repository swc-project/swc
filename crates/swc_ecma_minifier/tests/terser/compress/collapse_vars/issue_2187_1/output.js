var a = 1;
!function(foo) {
    foo();
    var a1 = 2;
    console.log(a1);
}(function() {
    console.log(a);
});

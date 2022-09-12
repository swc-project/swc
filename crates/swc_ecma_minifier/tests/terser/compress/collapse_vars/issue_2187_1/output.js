var a = 1;
!function(foo) {
    foo();
    console.log(2);
}(function() {
    console.log(a);
});

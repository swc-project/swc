var b = 10;
!function(arg) {
    for(var key in "hi")b = 42;
}(--b);
console.log(b);

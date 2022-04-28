var c = 0;
(function() {
    while(f());
    function f() {
        c = 1 + ++c;
    }
})(), console.log(c);

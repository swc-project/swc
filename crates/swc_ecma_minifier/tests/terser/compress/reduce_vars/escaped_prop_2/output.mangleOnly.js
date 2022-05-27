var a = {
    o: {
        a: 1
    }
};
(function(a) {
    a.a++;
})(a.o);
(function(a) {
    console.log(a.a);
})(a.o);

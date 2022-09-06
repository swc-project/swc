var o = { o: { a: 1 } };
(function (o) {
    o.a++;
})(o.o);
(function (o) {
    console.log(o.a);
})(o.o);

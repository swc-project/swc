var obj = { o: { a: 1 } };
(function (o) {
    o.a++;
})(obj.o);
(function (o) {
    console.log(o.a);
})(obj.o);

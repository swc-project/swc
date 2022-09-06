var o = 8;
(function (o, n) {
    o.toString();
})(--o, (o |= 10));
console.log(o);

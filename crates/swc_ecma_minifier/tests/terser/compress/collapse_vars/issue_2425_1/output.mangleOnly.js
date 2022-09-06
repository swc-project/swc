var o = 8;
(function (o) {
    o.toString();
})(--o, (o |= 10));
console.log(o);

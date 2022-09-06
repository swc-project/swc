var o = 0,
    n = 1;
var o = n++,
    n = +(function () {})();
o && o[o++];
console.log(o, n);

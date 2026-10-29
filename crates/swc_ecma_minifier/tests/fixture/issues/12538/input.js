(function (o, width) {
  o.f = function (x) {
    return lowbits(x) + width;
  };
  function lowbits(n) {
    return n & (width - 1);
  }
})(globalThis.o = {}, 256);

console.log(globalThis.o.f(1000));
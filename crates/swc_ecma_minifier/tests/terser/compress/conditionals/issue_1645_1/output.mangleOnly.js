var o = 100,
    l = 10;
(l = o) ? (o++ + (l += o) ? (l += o) : (l += o)) : (l ^= o);
console.log(o, l);

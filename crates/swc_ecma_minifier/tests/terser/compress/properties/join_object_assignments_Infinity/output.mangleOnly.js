var _ = {};
_[Infinity] = 1;
_[1 / 0] = 2;
_[-Infinity] = 3;
_[-1 / 0] = 4;
console.log(_[Infinity], _[1 / 0], _[-Infinity], _[-1 / 0]);

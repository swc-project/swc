var o = 1;
o++;
((function () {} || o || 3).toString());
console.log(o);

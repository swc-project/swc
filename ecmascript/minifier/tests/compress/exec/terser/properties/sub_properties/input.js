const a = {};

a[0] = 0;
a["0"] = 1;
a[3.14] = 2;
a["3" + ".14"] = 3;
a["i" + "f"] = 4;
a["foo" + " bar"] = 5;
a[0 / 0] = 6;
a[null] = 7;
a[undefined] = 8;

console.log(a)
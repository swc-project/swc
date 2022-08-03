var $ = {};
$[NaN] = 1;
$[0 / 0] = 2;
console.log($[NaN], $[NaN]);

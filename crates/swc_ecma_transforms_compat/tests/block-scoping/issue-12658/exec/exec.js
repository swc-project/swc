let r = "";
for (let i = 0; i < 3; i++) {
  (() => i++)();
  r += i;
}
console.log(r);

let s = "";
for (let j = 0; j < 6; j++) {
  (function () {
    j += 2;
  })();
  s += j;
  setTimeout(() => j);
}
console.log(s);

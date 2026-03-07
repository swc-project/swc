let a = 1 + 2 * 3;
const b = { x: a, __spread__: rest };
function f(x, y) {
  if (x) return y;
  return 0;
}
class C extends B {
  static m(x) {
    return x ?? 0;
  }
  static {
    a++;
  }
  p = 1;
}
for (let i = 0; i < 3; i++) a += i;
for (const k in obj) break;
for (const v of arr) a = v;
switch (a) {
  case 1:
    break;
  default:
    throw err;
}

let badfunc = () => {};

function f1() {
  badfunc = function badfunc () {}
  badfunc();
  f2();
}

function f2() {
  badfunc = () => {};
  f1();
}
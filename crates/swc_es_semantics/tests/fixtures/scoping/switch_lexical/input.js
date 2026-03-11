let a = 0;

switch (1) {
  case 1:
    let a = 1;
    function f() {
      return a;
    }
    f();
    break;
  default:
    break;
}

a;

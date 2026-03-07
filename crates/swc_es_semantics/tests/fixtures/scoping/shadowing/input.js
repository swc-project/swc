let x = 0;

function f(x) {
  let y = x;
  {
    let x = y + 1;
    class C {
      method(x) {
        let y = x;
        return y;
      }
    }
    y = x;
  }
  return x + y;
}

const add = (a, b) => a + b;

const wrap = () => {
  return add(1, 2);
};

class Box {
  static {
    let x = wrap();
    if (x) {
      x = x + 1;
    }
  }
}

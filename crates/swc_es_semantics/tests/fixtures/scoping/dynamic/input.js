function dynamic(obj) {
  with (obj) {
    eval("x = x + 1");
    return x;
  }
}

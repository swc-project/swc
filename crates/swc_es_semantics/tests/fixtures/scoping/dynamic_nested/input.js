function outer(obj) {
  function inner() {
    return eval("x") + x;
  }

  with (obj) {
    let x = 1;
    return inner();
  }
}

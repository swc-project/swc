function h(flag) {
  if (flag) {
    function inner() {
      return a;
    }

    var a = 1;
  }

  return inner();
}

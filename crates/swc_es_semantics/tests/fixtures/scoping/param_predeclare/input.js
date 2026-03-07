function f(a = b, b = 1, c = a + b) {
  return a + b + c;
}

f();

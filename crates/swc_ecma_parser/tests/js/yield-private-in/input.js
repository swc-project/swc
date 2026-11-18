class A {
  #x;
  *has(o) {
    yield #x in o;
    yield* #x in o;
    yield
    #x in o;
  }
}

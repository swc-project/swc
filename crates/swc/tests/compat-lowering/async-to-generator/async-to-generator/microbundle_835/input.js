
class A extends B {
  a() {
    (async () => {
      super.b();
    })();
  }
}

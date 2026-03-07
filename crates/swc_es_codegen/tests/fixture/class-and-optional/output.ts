@dec
class A extends B {
  @logged
  static value = 1;
  @trace
  method(a, b) {
    return a?.b?.(b);
  }
  static {
    this.value = this.value + 1;
  }
}

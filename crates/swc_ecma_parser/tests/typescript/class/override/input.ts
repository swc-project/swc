class C extends B {
  override prop = 5;
  override method() {
  }
}
// even without an extends it should set is_override
class C {
  override prop = 5;
  override method() {
  }
}
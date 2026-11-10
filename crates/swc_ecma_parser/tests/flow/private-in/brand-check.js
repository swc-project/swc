class A {
  #x;
  static has(o) {
    return #x in o;
  }
  static viaLogical(o) {
    return o != null && #x in o;
  }
  static viaEquality(o) {
    return true == #x in o;
  }
}

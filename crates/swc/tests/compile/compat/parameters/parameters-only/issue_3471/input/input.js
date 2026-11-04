
class A {
  a = 1 + ((...a) => a)
  b = (...b) => b + this
  static c = (c = 123) => c + this
}
  
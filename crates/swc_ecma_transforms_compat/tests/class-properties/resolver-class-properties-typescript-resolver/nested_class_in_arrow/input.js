
const a = () => class {
  a = 123
  foo() {
    return class B {
      b = 456
    }
  }
}

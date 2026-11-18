class A {
  #p: number
  m() {
    super.#p; // Error, super.PrivateName is not allowed
  }
}

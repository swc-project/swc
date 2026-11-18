class A {
  #p: number
  constructor() {
    delete this.#p; // Error can't delete private!
    delete ((this.#p)) // Error, can't delete private
  }
}

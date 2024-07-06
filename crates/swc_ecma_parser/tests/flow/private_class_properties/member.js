class A {
  #p: number
  constructor() {
    #p; // Error! Private property must be a member
    this.#p;
    this.other.#p;
  }
}

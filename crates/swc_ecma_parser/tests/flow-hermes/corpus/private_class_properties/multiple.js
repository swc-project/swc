class A {
  #p: number
  #q: number
  #p: number // Error, multiple definitions of #p
  static #q: number // Error, multiple fields named #q
}

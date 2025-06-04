// This is a test for method name mangling
class e {
  constructor() {
    this.value = 10;
  }

  // This method should be mangled
  calculateValue() {
    return this.value * 2;
  }

  // This method should be mangled
  increaseValue(e) {
    this.value += e;
    return this.value;
  }

  // Special methods should not be mangled
  toString() {
    return `Value: ${this.value}`;
  }

  // Private methods should be mangled if private mangling is enabled
  #e() {
    return this.value * 3;
  }

  // Method that uses the private method
  usePrivate() {
    return this.#e();
  }
}

// Object method should also be mangled
const t = {
  methodA() {
    return 'A';
  },
  methodB() {
    return 'B';
  }
};

// Export to prevent the class from being removed by dead code elimination
export { e as TestClass, t as obj }; 

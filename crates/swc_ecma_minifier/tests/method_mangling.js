// This is a test for method name mangling
class TestClass {
  constructor() {
    this.value = 10;
  }

  // This method should be mangled
  calculateValue() {
    return this.value * 2;
  }

  // This method should be mangled
  increaseValue(amount) {
    this.value += amount;
    return this.value;
  }

  // Special methods should not be mangled
  toString() {
    return `Value: ${this.value}`;
  }

  // Private methods should be mangled if private mangling is enabled
  #privateMethod() {
    return this.value * 3;
  }

  // Method that uses the private method
  usePrivate() {
    return this.#privateMethod();
  }
}

// Object method should also be mangled
const obj = {
  methodA() {
    return 'A';
  },
  methodB() {
    return 'B';
  }
};

// Export to prevent the class from being removed by dead code elimination
export { TestClass, obj }; 

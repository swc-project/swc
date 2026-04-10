const dec = () => {};

const otherProto = {
  id(value) {
    return `object:${value}`;
  }
};

class Base {
  static id(value) {
    return `base:${value}`;
  }
}

@dec
class Derived extends Base {
  static nested = {
    __proto__: otherProto,
    getId(value) {
      return super.id(value);
    }
  };

  static callNested(value) {
    return this.nested.getId(value);
  }
}

expect(Derived.callNested("value")).toBe("object:value");

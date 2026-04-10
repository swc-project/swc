const dec = () => {};

class Base {
  static styles = ["base"];
  static color = "blue";
  static id(value) {
    return `base:${value}`;
  }
  static method() {
    return "base-method";
  }
  static accessor value = "base-accessor";
}

@dec
class Derived extends Base {
  static styles = [...super.styles, "derived"];
  static accessor value = super.value;

  static #callSuper() {
    return super.method();
  }

  static callSuper() {
    return Derived.#callSuper();
  }

  static {
    this.blockValue = super.id(super.color);
  }
}

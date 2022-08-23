"use strict";
class Base {
  test(...args) {
    expect(this).toBe(obj);
    expect(args).toEqual([1, 2, 3]);
    return 1;
  }
}

class Obj extends Base {
  call() {
    super.test(1, 2, 3);
    super.test(1, ...[2, 3]);
    super.test(...[1, 2, 3]);
    return super.test(...arguments);
  }

  test() {
    throw new Error("called");
  }
}

const obj = new Obj();
expect(obj.call(1, 2, 3)).toBe(1);

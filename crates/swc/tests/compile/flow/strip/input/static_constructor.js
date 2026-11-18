class C {
  static async *constructor() {
    yield 1;
  }

  static get constructor() {
    return 2;
  }
}

export { C };

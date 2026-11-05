
class Foo extends Bar {
  constructor(options) {
    super(
      {
        callA: async () => {
          this.callA();
        },
      }
    );
  }
}

const logs = [];

const decorator = (_, context) => {
  context.addInitializer(() => {
    logs.push(context.static ? "static" : "instance");
  });
};

class A {
  @decorator
  field;

  @decorator
  static field;
}

expect(logs).toEqual(["static"]);
new A();
expect(logs).toEqual(["static", "instance"]);

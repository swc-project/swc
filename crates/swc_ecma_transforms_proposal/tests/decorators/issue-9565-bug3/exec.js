let contextRef;

function captureAccess(_, context) {
  contextRef = context;
}

class A {
  x = "test-value";

  @captureAccess
  get value() {
    return this.x;
  }
}

const a = new A();
expect(contextRef.access.get(a)).toBe("test-value");
expect(contextRef.access.get.call(a)).toBe("test-value");

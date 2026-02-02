// Test that `this` context in decorated getter's context.access.get works correctly
// Bug 3: The `this` context when calling context.access.get.call(this) was incorrect

let accessedValues = [];

function captureAccess(target, context) {
  const originalGet = context.access.get;
  context.addInitializer(function() {
    // `this` should be the instance here
    accessedValues.push(originalGet.call(this));
  });
}

class A {
  @captureAccess
  get value() {
    return 'test-value';
  }
}

const a = new A();

// The getter should have been accessed during initialization
expect(accessedValues).toEqual(['test-value']);

// Direct access should also work
expect(a.value).toBe('test-value');

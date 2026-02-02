// Test that decorators on private fields work correctly
// Bug: _initProto was being injected into private field initializers,
// causing addInitializer callbacks to fail when accessing private fields

let callCount = 0;

function effect(getDep) {
  return function (_, context) {
    context.addInitializer(function () {
      // This should be able to access the private field after initialization
      const fn = context.access.get.call(this);
      if (typeof fn === 'function') {
        fn();
      }
    });
  }
}

class A {
  @effect(() => [1, 2])
  #effect = () => {
    callCount++;
  }
}

new A();

// The initializer should have been called during construction
expect(callCount).toBe(1);

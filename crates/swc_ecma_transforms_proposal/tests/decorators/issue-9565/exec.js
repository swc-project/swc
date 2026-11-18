let callCount = 0;

function effect(getDep) {
  return function (_, context) {
    context.addInitializer(function () {
      const fn = context.access.get(this);
      if (typeof fn === "function") {
        fn();
      }
    });
  };
}

class A {
  @effect(() => [1, 2])
  #effect = () => {
    callCount++;
  };
}

new A();
expect(callCount).toBe(1);

// Pretend that `Reflect.construct` isn't supported.
global.Reflect = undefined;

global.HTMLElement = function() {
  // Here, `this.HTMLElement` is this function, not the original HTMLElement
  // constructor. `this.constructor` should be this function too, but isn't.
  constructor = this.constructor;
};

var constructor;

class CustomElement extends HTMLElement {}
new CustomElement();

expect(constructor).toBe(CustomElement);

// Test that decorator expressions containing private field access work correctly
// Bug 1: Decorator expressions like @effect(() => this.#log) were being moved
// outside the class, causing "reference to undeclared private field" errors

let logs = [];

function effect(getDep) {
  return function (_, context) {
    context.addInitializer(function () {
      logs.push('init');
    });
  }
}

class A {
  @effect(() => [1, 2])
  get log() {
    return this.#log;
  }

  #log = 'private';
}

const a = new A();
expect(logs).toEqual(['init']);
expect(a.log).toBe('private');

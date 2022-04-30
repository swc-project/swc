class Foo {
	#bar = 'i\'m a private field!';

  #privateMethod() {
    return 'i\'m a private method!';
  }

  foo() {
    return this.#bar;
  }

  bar() {
    return this.#privateMethod();
  }
}

var f = new Foo();
console.log(f.foo());
console.log(f.bar());
foo.#bar;
foo.#privateMethod();

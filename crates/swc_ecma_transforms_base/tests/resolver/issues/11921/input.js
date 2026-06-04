const foo = () => (args) => class A {};
new (foo()`bar`)();

class MyClass<T> { };
type MyType = {};
export const fn = <T>() => class extends MyClass<MyClass<T>> { static x = 5; };
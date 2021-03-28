class MyClass<T> { };
type MyType = {};
export const fn = <T>() => class extends MyClass<Omit<MyType, 'x'> & T> { };
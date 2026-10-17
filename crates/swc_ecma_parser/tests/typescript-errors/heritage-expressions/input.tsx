export {};
interface Invalid extends (Base<T>) {}
class InvalidImpl implements (Base<T>) {}
interface Computed extends namespace[key]<T> {}
class FactoryImpl implements factory().Type<T> {}

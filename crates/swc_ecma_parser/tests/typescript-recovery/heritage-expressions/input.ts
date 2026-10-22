export {};
interface Parenthesized extends (Base<T>) {}
interface Nested extends (Base<T>)<U> {}
class ParenthesizedImpl implements (Base<T>) {}
class NestedImpl implements (Base<T>)<U> {}
interface Computed extends namespace[key]<T> {}
class FactoryImpl implements factory().Type<T> {}
interface Qualified extends namespace.Base<T> {}
class MultipleImpl implements Base<T>, namespace.Base<U> {}

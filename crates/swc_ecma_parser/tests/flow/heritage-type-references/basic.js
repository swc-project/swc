class C implements switch {}
class Generic<T> implements switch<T>, ns.I<T> {}
interface I extends switch {}
interface GenericInterface<T> extends switch<T>, ns.I<T> {}
class Derived extends factory() implements switch {}

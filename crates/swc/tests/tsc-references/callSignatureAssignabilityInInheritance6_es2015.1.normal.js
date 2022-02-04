// checking subtype relations for function types as it relates to contextual signature instantiation
// same as subtypingWithCallSignatures4 but using class type parameters instead of generic signatures
// all are errors
class Base {
}
class Derived extends Base {
}
class Derived2 extends Derived {
}
class OtherDerived extends Base {
}

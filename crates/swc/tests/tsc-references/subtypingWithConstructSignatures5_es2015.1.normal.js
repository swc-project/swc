// checking subtype relations for function types as it relates to contextual signature instantiation
// same as subtypingWithConstructSignatures2 just with an extra level of indirection in the inheritance chain
class Base {
}
class Derived extends Base {
}
class Derived2 extends Derived {
}
class OtherDerived extends Base {
}

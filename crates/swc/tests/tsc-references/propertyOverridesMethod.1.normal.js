//// [propertyOverridesMethod.ts]
class A {
    m() {}
}
class B extends A {
    m = ()=>1;
}

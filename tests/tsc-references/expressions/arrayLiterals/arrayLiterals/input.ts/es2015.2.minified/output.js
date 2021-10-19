class C {
}
new C(), new C();
class Base {
}
class Derived1 extends Base {
}
new Derived1(), new class extends Base {
}(), new Derived1(), new Derived1();

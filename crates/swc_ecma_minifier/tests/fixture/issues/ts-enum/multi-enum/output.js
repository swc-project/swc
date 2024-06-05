var Foo, Foo1, Foo2;
(Foo1 = Foo || (Foo = {}))[Foo1.a = 1] = "a", (Foo2 = Foo || (Foo = {}))[Foo2.b = 2] = "b";
export { Foo };

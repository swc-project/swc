//// [typeOfThisInStaticMembers13.ts]
class C {
    static c = "foo";
    static bar = class Inner {
        static [this.c] = 123;
        [this.c] = 123;
    };
}

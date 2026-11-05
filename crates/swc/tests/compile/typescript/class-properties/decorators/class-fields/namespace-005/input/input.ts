
    namespace A {
        export class Test {}
    }
    namespace B {
        export import a = A;
        console.log(a.Test);
        import b = A;
        console.log(b.Test);
    }

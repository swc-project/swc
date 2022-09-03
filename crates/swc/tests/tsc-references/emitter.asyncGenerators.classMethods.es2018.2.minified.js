//// [C1.ts]
class C1 {
    async *f() {}
}
//// [C2.ts]
class C2 {
    async *f() {
        yield;
    }
}
//// [C3.ts]
class C3 {
    async *f() {
        yield 1;
    }
}
//// [C4.ts]
class C4 {
    async *f() {
        yield* [
            1
        ];
    }
}
//// [C5.ts]
class C5 {
    async *f() {
        yield* async function*() {
            yield 1;
        }();
    }
}
//// [C6.ts]
class C6 {
    async *f() {
        await 1;
    }
}
//// [C7.ts]
class C7 {
    async *f() {
        return 1;
    }
}
//// [C8.ts]
class C8 {
    g() {}
    async *f() {
        this.g();
    }
}
//// [C9.ts]
class B9 {
    g() {}
}
class C9 extends B9 {
    async *f() {
        super.g();
    }
}

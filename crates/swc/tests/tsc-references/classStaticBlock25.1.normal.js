//// [classStaticBlock25.ts]
const a = 1;
const b = 2;
class C {
    static{
        const a = 11;
        a;
        b;
    }
    static{
        const a = 11;
        a;
        b;
    }
}

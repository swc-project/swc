//// [classStaticBlock2.ts]
const a = 1;
const b = 2;
class C {
    static{
        const a1 = 11;
        a1;
        b;
    }
    static{
        const a2 = 11;
        a2;
        b;
    }
}

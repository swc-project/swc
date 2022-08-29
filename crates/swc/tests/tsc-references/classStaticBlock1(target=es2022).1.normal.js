//// [classStaticBlock1.ts]
const a = 2;
class C {
    static{
        const a1 = 1;
        a1;
    }
}

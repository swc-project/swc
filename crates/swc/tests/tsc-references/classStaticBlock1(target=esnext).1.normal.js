//// [classStaticBlock1.ts]
const a = 2;
class C {
    static{
        const a = 1;
        a;
    }
}

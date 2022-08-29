//// [classStaticBlockUseBeforeDef2.ts]
class C {
    static{
        this.x = 1;
    }
}

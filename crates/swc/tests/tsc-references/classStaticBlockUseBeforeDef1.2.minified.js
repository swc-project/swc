//// [classStaticBlockUseBeforeDef1.ts]
class C {
    static{
        this.x = 1;
    }
    static y = this.x;
    static{
        this.z = this.y;
    }
}

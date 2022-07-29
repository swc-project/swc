class C {
    static m(x) {}
    m(x) {}
    constructor(){
        this.p = (x)=>{};
    }
}
C.m(), new C().m(), new C().p();
const obj = {
    m (x) {},
    p: (x)=>{}
};
obj.m(), obj.p();

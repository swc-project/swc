class C {
    static m(x) {
    }
    m(x1) {
    }
    constructor(){
        this.p = (x)=>{
        };
    }
}
C.m(), new C().m(), new C().p();
const obj = {
    m (x2) {
    },
    p: (x)=>{
    }
};
obj.m(), obj.p();

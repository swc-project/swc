class C {
    static m(x2) {
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
    m (x3) {
    },
    p: (x)=>{
    }
};
obj.m(), obj.p();

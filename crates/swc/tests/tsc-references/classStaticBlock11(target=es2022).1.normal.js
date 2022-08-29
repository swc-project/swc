//// [classStaticBlock11.ts]
let getX;
class C {
    #x = 1;
    constructor(x){
        this.#x = x;
    }
    static{
        // getX has privileged access to #x
        getX = (obj)=>obj.#x;
    }
}

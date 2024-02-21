//// [classStaticBlock11.ts]
let getX;
class C {
    #x;
    constructor(x){
        this.#x = 1;
        this.#x = x;
    }
    static{
        // getX has privileged access to #x
        getX = (obj)=>obj.#x;
    }
}

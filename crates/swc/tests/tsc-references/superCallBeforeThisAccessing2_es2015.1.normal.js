class Base {
    constructor(c){
    }
}
class D extends Base {
    constructor(){
        super(()=>{
            this._t;
        }); // no error. only check when this is directly accessing in constructor
    }
}

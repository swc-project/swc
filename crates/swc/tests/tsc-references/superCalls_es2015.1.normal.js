class Base {
    constructor(n){
        this.x = 43;
    }
}
function v() {
}
class Derived extends Base {
    //super call in class constructor of derived type
    constructor(q){
        super('');
        this.q = q;
        var _temp;
        //type of super call expression is void
        var p = (_temp = super(''), this.q = q, _temp);
        var p = v();
    }
}
class OtherBase {
}
class OtherDerived extends OtherBase {
    constructor(){
        var p = '';
        super();
    }
}

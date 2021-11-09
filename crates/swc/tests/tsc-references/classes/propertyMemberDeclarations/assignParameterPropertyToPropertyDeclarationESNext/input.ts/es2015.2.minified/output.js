class F {
    constructor(){
        this.Inner = class extends F {
            constructor(...args){
                super(...args), this.p2 = this.p1;
            }
        }, this.p1 = 0;
    }
}
class G {
    constructor(p1){
        this.p1 = p1, this.Inner = class extends G {
            constructor(...args){
                super(...args), this.p2 = this.p1;
            }
        };
    }
}

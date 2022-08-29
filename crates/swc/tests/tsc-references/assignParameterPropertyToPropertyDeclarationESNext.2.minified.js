//// [assignParameterPropertyToPropertyDeclarationESNext.ts]
class F {
    Inner = class extends F {
        p2 = this.p1;
    };
    p1 = 0;
}
class G {
    Inner;
    constructor(p1){
        this.p1 = p1, this.Inner = class extends G {
            p2 = this.p1;
        };
    }
    p1;
}

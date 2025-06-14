//// [assignParameterPropertyToPropertyDeclarationES2022.ts]
class F {
    Inner = class extends F {
        p2 = this.p1;
    };
    p1 = 0;
}
class G {
    p1;
    Inner = class extends G {
        p2 = this.p1;
    };
    constructor(p1){
        this.p1 = p1;
    }
}

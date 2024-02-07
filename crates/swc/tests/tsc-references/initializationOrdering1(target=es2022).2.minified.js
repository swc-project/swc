//// [initializationOrdering1.ts]
export class Broken {
    constructor(facade){
        this.facade = facade, this.bug = this.facade.create(), console.log(this.bug);
    }
}
new Broken(new class {
    create() {
        return !0;
    }
});

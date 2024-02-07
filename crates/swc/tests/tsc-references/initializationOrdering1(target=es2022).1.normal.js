//// [initializationOrdering1.ts]
class Helper {
    create() {
        return true;
    }
}
export class Broken {
    constructor(facade){
        this.facade = facade;
        this.bug = this.facade.create();
        console.log(this.bug);
    }
}
new Broken(new Helper);

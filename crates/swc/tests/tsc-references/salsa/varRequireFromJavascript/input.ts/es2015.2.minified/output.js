export class Crunch {
    m() {
        return this.n;
    }
    constructor(n){
        this.n = n;
    }
}
new (require("./ex")).Crunch(1).n;

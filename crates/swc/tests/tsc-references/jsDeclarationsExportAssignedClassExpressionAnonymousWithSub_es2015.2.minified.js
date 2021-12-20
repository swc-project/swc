module.exports = class {
    constructor(p){
        this.t = 12 + p;
    }
}, module.exports.Sub = class {
    constructor(){
        this.instance = new module.exports(10);
    }
};

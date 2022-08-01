module.exports = class {
    method() {}
    constructor(){
        this.item = 3;
    }
};
module.exports = {
    Wrap: class {
        constructor(c){
            this.connItem = c.item, this.another = "";
        }
    }
};

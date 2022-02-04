module.exports = class {
    constructor(){
        this.x = 12;
    }
};
const Obj = require("./obj");
module.exports = class {
    constructor(){
        this.usage = new Obj();
    }
};

//// [base.js]
class Base {
    constructor(){}
}
let BaseFactory = ()=>new Base();
BaseFactory.Base = Base, module.exports = BaseFactory;
//// [file.js]

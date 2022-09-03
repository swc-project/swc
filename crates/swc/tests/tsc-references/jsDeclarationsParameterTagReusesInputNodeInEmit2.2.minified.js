//// [base.js]
class Base {
    constructor(){}
}
const BaseFactory = ()=>new Base();
BaseFactory.Base = Base, module.exports = BaseFactory;
//// [file.js]
const test = (base)=>base;

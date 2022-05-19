class Base {
    constructor(){}
}
const BaseFactory = ()=>new Base();
BaseFactory.Base = Base, module.exports = BaseFactory;

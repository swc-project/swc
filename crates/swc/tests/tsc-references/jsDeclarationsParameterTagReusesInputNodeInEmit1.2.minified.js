//// [base.js]
class Base {
    constructor(){}
}
const BaseFactory = ()=>new Base();
BaseFactory.Base = Base, module.exports = BaseFactory;
//// [file.js]
/** @typedef {import('./base')} BaseFactory */ /**
 * @callback BaseFactoryFactory
 * @param {import('./base')} factory
 */ /** @enum {import('./base')} */ 

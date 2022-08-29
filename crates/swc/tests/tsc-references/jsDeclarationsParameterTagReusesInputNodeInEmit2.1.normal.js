//// [base.js]
class Base {
    constructor(){}
}
const BaseFactory = ()=>{
    return new Base();
};
BaseFactory.Base = Base;
module.exports = BaseFactory;
//// [file.js]
/** @typedef {typeof import('./base')} BaseFactory */ /**
 *
 * @param {InstanceType<BaseFactory["Base"]>} base
 * @returns {InstanceType<BaseFactory["Base"]>}
 */ const test = (base)=>{
    return base;
};

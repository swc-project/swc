//// [base.js]
class Base {
}
let BaseFactory = ()=>new Base();
BaseFactory.Base = Base, module.exports = BaseFactory;
//// [file.js]

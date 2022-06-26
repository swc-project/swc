let foo1 = require('./foo1'), foo2 = require('./foo2');
class x extends foo2.x {
}
module.exports = {
    x: foo1
};
export { };

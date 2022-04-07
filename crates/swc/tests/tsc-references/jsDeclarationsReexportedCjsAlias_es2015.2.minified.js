function bar(a) {
    return a + a;
}
class SomeClass {
    a() {
        return 1;
    }
}
module.exports = {
    bar,
    SomeClass
};
const { SomeClass , SomeClass: Another  } = require('./lib');
module.exports = {
    SomeClass,
    Another
};

class SomeClass {
    a() {
        return 1;
    }
}
module.exports = {
    bar: function(a) {
        return a + a;
    },
    SomeClass
};
const { SomeClass , SomeClass: Another  } = require('./lib');
module.exports = {
    SomeClass,
    Another
};

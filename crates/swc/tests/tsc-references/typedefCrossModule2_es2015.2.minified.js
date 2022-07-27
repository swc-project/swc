exports.Bar = class {
}, module.exports = {
    Baz: class {
    }
}, exports.Quid = 2, module.exports = {
    Quack: 2
};
new (require('./mod1.js')).Baz();

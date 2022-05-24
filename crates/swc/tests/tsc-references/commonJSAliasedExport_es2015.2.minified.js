function funky(declaration) {
    return !1;
}
module.exports = (ast)=>ast, module.exports.funky = funky;
const { funky  } = require('./commonJSAliasedExport');
funky(1);

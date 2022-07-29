module.exports = {
    hardline: {
        type: "hard"
    }
};
module.exports = {
    nested: require('./first')
};
const { hardline  } = require('./second').nested;
